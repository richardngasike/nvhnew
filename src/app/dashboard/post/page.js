'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { listingsAPI } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import styles from './post.module.css';

const AMENITIES_LIST = [
  'WiFi', 'Parking', 'Security', 'Water', 'Electricity', 'Furnished',
  'Gym', 'Pool', 'Garden', 'CCTV', 'Backup Generator', 'Elevator',
  'Balcony', 'Air Conditioning', 'Study Room'
];

const NAIROBI_LOCATIONS = [
  'Westlands', 'Kilimani', 'Kasarani', 'Embakasi', 'Langata',
  'Karen', 'Kileleshwa', 'Lavington', 'South B', 'South C',
  'Thika Road', 'Ruaka', 'Rongai', 'Ngong Road', 'Upperhill',
  'Gigiri', 'Runda', 'Muthaiga', 'Spring Valley', 'Parklands', 'Other'
];

export default function PostListingPage() {
  const { landlord, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1); // 1=details, 2=photos, 3=payment
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    sub_location: '',
    property_type: '',
    price: '',
    deposit: '',
    amenities: [],
    contact_phone: '',
    available_from: '',
    floor_number: '',
    total_floors: '',
    size_sqft: '',
    mpesa_phone: ''
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!authLoading && !landlord) router.push('/auth/login');
  }, [landlord, authLoading]);

  useEffect(() => {
    if (landlord) setForm(f => ({ ...f, contact_phone: landlord.phone, mpesa_phone: landlord.phone }));
  }, [landlord]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);
    const newPreviews = newImages.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const removeImage = (idx) => {
    const newImages = images.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const validateStep1 = () => {
    if (!form.title || !form.location || !form.property_type || !form.price) {
      setError('Please fill in all required fields');
      return false;
    }
    if (Number(form.price) < 1000) {
      setError('Price must be at least KES 1,000');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (images.length < 1) {
      setError('Please upload at least 1 image');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!form.mpesa_phone) {
      setError('Please enter your M-Pesa phone number');
      return;
    }
    if (!/^(07|01)\d{8}$/.test(form.mpesa_phone.replace(/\s/g, ''))) {
      setError('Enter a valid Safaricom number (07XXXXXXXX)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'amenities') {
          v.forEach(a => formData.append('amenities', a));
        } else if (v !== '') {
          formData.append(k, v);
        }
      });
      images.forEach(img => formData.append('images', img));

      const data = await listingsAPI.create(formData);
      setListingId(data.listing_id);
      setCheckoutId(data.checkout_request_id);
      setSubmitted(true);
      setStep(4);

      if (data.mpesa_demo) {
        toast.info('Demo mode: Listing created. Activate manually in dashboard.');
      } else {
        toast.success('Check your phone for M-Pesa payment prompt!');
        startPolling(data.checkout_request_id, data.listing_id);
      }
    } catch (err) {
      setError(err.error || 'Failed to submit listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (checkoutRequestId, lid) => {
    setPolling(true);
    let count = 0;
    const interval = setInterval(async () => {
      count++;
      try {
        const payment = await listingsAPI.checkPayment(checkoutRequestId);
        if (payment.status === 'completed') {
          clearInterval(interval);
          setPolling(false);
          toast.success('Payment received! Your listing is now live.');
          router.push('/dashboard/listings');
        } else if (payment.status === 'failed' || payment.status === 'cancelled') {
          clearInterval(interval);
          setPolling(false);
          toast.error('Payment failed. Please try again from your dashboard.');
        }
      } catch (e) {}
      if (count >= 30) { clearInterval(interval); setPolling(false); }
    }, 5000);
  };

  const activateDemo = async () => {
    if (!listingId) return;
    try {
      await listingsAPI.activate(listingId);
      toast.success('Listing activated! (Demo mode)');
      router.push('/dashboard/listings');
    } catch (err) {
      toast.error('Failed to activate listing');
    }
  };

  if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Post a New Listing</h1>
          <p className={styles.pageSubtitle}>Fill in your property details and pay KES 300 via M-Pesa to go live</p>
        </div>
      </div>

      <div className="container">
        {/* Step Indicator */}
        {step < 4 && (
          <div className={styles.steps}>
            {['Property Details', 'Photos', 'Payment'].map((s, i) => (
              <div key={i} className={`${styles.step} ${step > i + 1 ? styles.stepDone : ''} ${step === i + 1 ? styles.stepActive : ''}`}>
                <div className={styles.stepCircle}>{step > i + 1 ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.formCard}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Step 1: Details */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Property Details</h2>

              <div className={styles.formGrid}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Listing Title *</label>
                  <input className="form-control" value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Modern 2-Bedroom Apartment in Westlands" required />
                </div>

                <div className="form-group">
                  <label>Property Type *</label>
                  <select className="form-control" value={form.property_type} onChange={e => update('property_type', e.target.value)} required>
                    <option value="">Select type</option>
                    <option value="bedsitter">Bedsitter</option>
                    <option value="single_room">Single Room</option>
                    <option value="one_bedroom">One Bedroom</option>
                    <option value="two_bedroom">Two Bedroom</option>
                    <option value="three_bedroom">Three Bedroom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <select className="form-control" value={form.location} onChange={e => update('location', e.target.value)} required>
                    <option value="">Select area</option>
                    {NAIROBI_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sub-location / Street</label>
                  <input className="form-control" value={form.sub_location} onChange={e => update('sub_location', e.target.value)} placeholder="e.g. Riverside Drive, Rhapta Road" />
                </div>

                <div className="form-group">
                  <label>Monthly Rent (KES) *</label>
                  <input type="number" className="form-control" value={form.price} onChange={e => update('price', e.target.value)} placeholder="e.g. 15000" min="1000" required />
                </div>

                <div className="form-group">
                  <label>Deposit (KES)</label>
                  <input type="number" className="form-control" value={form.deposit} onChange={e => update('deposit', e.target.value)} placeholder="e.g. 30000" />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input className="form-control" value={form.contact_phone} onChange={e => update('contact_phone', e.target.value)} placeholder="0712345678" />
                </div>

                <div className="form-group">
                  <label>Available From</label>
                  <input type="date" className="form-control" value={form.available_from} onChange={e => update('available_from', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Size (sq ft)</label>
                  <input type="number" className="form-control" value={form.size_sqft} onChange={e => update('size_sqft', e.target.value)} placeholder="e.g. 450" />
                </div>

                <div className="form-group">
                  <label>Floor Number</label>
                  <input type="number" className="form-control" value={form.floor_number} onChange={e => update('floor_number', e.target.value)} placeholder="e.g. 3" />
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Description</label>
                  <textarea className="form-control" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the property, neighborhood, what makes it special..." rows={4} />
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Amenities</label>
                  <div className={styles.amenitiesGrid}>
                    {AMENITIES_LIST.map(a => (
                      <label key={a} className={`${styles.amenityCheck} ${form.amenities.includes(a) ? styles.checked : ''}`}>
                        <input
                          type="checkbox"
                          checked={form.amenities.includes(a)}
                          onChange={() => toggleAmenity(a)}
                          style={{ display: 'none' }}
                        />
                        <span>{form.amenities.includes(a) ? '✓ ' : ''}{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.stepActions}>
                <button className="btn btn-primary btn-lg" onClick={() => { if (validateStep1()) setStep(2); }}>
                  Next: Add Photos →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Photos */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Upload Photos</h2>
              <p className={styles.stepDesc}>Upload up to 5 clear photos of your property. Good photos get more inquiries!</p>

              <div className={styles.uploadZone} onClick={() => fileInputRef.current?.click()}>
                <div className={styles.uploadIcon}>📸</div>
                <strong>Click to upload photos</strong>
                <span>JPG, PNG, WebP — Max 5MB each — Up to 5 photos</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  style={{ display: 'none' }}
                />
              </div>

              {previews.length > 0 && (
                <div className={styles.previewGrid}>
                  {previews.map((src, i) => (
                    <div key={i} className={styles.previewItem}>
                      <img src={src} alt={`Photo ${i + 1}`} />
                      {i === 0 && <div className={styles.primaryBadge}>Main Photo</div>}
                      <button className={styles.removePhoto} onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <div className={styles.addMore} onClick={() => fileInputRef.current?.click()}>
                      <span>➕</span>
                      <span>Add More</span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.stepActions}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={() => { if (validateStep2()) setStep(3); }}>
                  Next: Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>M-Pesa Payment</h2>

              <div className={styles.paymentInfo}>
                <div className={styles.payAmount}>
                  <span>Listing Fee</span>
                  <strong>KES 300</strong>
                </div>
                <div className={styles.payDetails}>
                  <p>✅ Pay once per listing</p>
                  <p>✅ Your listing goes live immediately after payment</p>
                  <p>✅ Reaches thousands of potential tenants</p>
                </div>
              </div>

              <div className={styles.mpesaForm}>
                <div className={styles.mpesaLogo}>
                  <span style={{ fontSize: '2rem' }}>📱</span>
                  <strong>M-Pesa STK Push</strong>
                </div>
                <div className="form-group">
                  <label>Safaricom Number for Payment *</label>
                  <input
                    className="form-control"
                    value={form.mpesa_phone}
                    onChange={e => update('mpesa_phone', e.target.value)}
                    placeholder="e.g. 0712345678"
                    style={{ fontSize: '1.1rem', fontWeight: '600' }}
                  />
                  <small style={{ color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                    A payment request of KES 300 will be sent to this Safaricom number.
                  </small>
                </div>

                <div className={styles.mpesaNote}>
                  <strong>How it works:</strong>
                  <ol>
                    <li>Click "Pay & Submit Listing"</li>
                    <li>You'll receive an M-Pesa prompt on your phone</li>
                    <li>Enter your M-Pesa PIN to confirm</li>
                    <li>Your listing will go live instantly!</li>
                  </ol>
                </div>
              </div>

              <div className={styles.stepActions}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                  {loading ? '⏳ Processing...' : '💳 Pay KES 300 & Submit Listing'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className={styles.confirmation}>
              <div className={styles.confirmIcon}>{polling ? '⏳' : '🎉'}</div>
              <h2>{polling ? 'Waiting for Payment...' : 'Listing Submitted!'}</h2>
              {polling ? (
                <>
                  <p>Please complete the M-Pesa payment on your phone.</p>
                  <p>Enter your PIN when prompted. We'll activate your listing automatically.</p>
                  <div className="spinner" style={{ margin: '20px auto' }} />
                </>
              ) : (
                <>
                  <p>Your listing has been submitted. Complete M-Pesa payment to activate it.</p>
                  <div className={styles.confirmActions}>
                    <button className="btn btn-primary btn-lg" onClick={activateDemo}>
                      🚀 Activate (Demo Mode)
                    </button>
                    <button className="btn btn-secondary" onClick={() => router.push('/dashboard/listings')}>
                      View My Listings
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
