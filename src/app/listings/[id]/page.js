'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { listingsAPI } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import styles from './listing.module.css';

const AMENITY_ICONS = {
  wifi: '📶', parking: '🅿️', security: '🔒', water: '💧',
  electricity: '⚡', furnished: '🛋️', gym: '💪', pool: '🏊',
  garden: '🌿', backup: '🔋', cctv: '📷', elevator: '🛗'
};

const TYPE_LABELS = {
  bedsitter: 'Bedsitter', single_room: 'Single Room',
  one_bedroom: 'One Bedroom', two_bedroom: 'Two Bedroom', three_bedroom: 'Three Bedroom'
};

export default function ListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [inquiry, setInquiry] = useState({ name: '', phone: '', message: '' });
  const [review, setReview] = useState({ reviewer_name: '', rating: 5, comment: '' });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    fetchListing();
    const favs = JSON.parse(localStorage.getItem('nhv_favorites') || '[]');
    setFavorited(favs.includes(Number(id)));
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await listingsAPI.getOne(id);
      setListing(data);
    } catch (error) {
      toast.error('Listing not found');
      router.push('/listings');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('nhv_favorites') || '[]');
    let newFavs;
    if (favorited) {
      newFavs = favs.filter(i => i !== Number(id));
      toast.info('Removed from favorites');
    } else {
      newFavs = [...favs, Number(id)];
      toast.success('Added to favorites!');
    }
    localStorage.setItem('nhv_favorites', JSON.stringify(newFavs));
    setFavorited(!favorited);
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    try {
      await listingsAPI.inquire(id, inquiry);
      toast.success('Inquiry sent! The landlord will contact you soon.');
      setShowInquiry(false);
      setInquiry({ name: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await listingsAPI.addReview(id, review);
      toast.success('Review submitted!');
      setShowReview(false);
      fetchListing();
    } catch (error) {
      toast.error('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className={styles.loadingPage}>
      <div className="spinner" />
      <p>Loading listing...</p>
    </div>
  );

  if (!listing) return null;

  const images = listing.images || [];
  const avgRating = parseFloat(listing.avg_rating || 0);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>→</span>
          <Link href="/listings">Listings</Link>
          <span>→</span>
          <span>{listing.title}</span>
        </nav>

        <div className={styles.layout}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            {/* Image Gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                {images[activeImage] ? (
                  <img src={`http://localhost:5000${images[activeImage]}`} alt={listing.title} />
                ) : (
                  <div className={styles.noImage}>🏠</div>
                )}
                <div className={styles.imageCount}>
                  {activeImage + 1} / {Math.max(images.length, 1)}
                </div>
                {images.length > 1 && (
                  <>
                    <button className={`${styles.galleryNav} ${styles.navPrev}`} onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}>‹</button>
                    <button className={`${styles.galleryNav} ${styles.navNext}`} onClick={() => setActiveImage(i => (i + 1) % images.length)}>›</button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className={styles.thumbs}>
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={`${styles.thumb} ${activeImage === i ? styles.activeThumb : ''}`}
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={`http://localhost:5000${img}`} alt={`Photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About This Property</h2>
              <p className={styles.description}>
                {listing.description || 'No description provided.'}
              </p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Amenities & Features</h2>
                <div className={styles.amenitiesGrid}>
                  {listing.amenities.map((amenity, i) => (
                    <div key={i} className={styles.amenityItem}>
                      <span className={styles.amenityIcon}>
                        {AMENITY_ICONS[amenity.toLowerCase()] || '✓'}
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Property Details</h2>
              <div className={styles.detailsGrid}>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Type</span>
                  <span className={styles.detailValue}>{TYPE_LABELS[listing.property_type] || listing.property_type}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>{listing.location}</span>
                </div>
                {listing.sub_location && (
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Sub-location</span>
                    <span className={styles.detailValue}>{listing.sub_location}</span>
                  </div>
                )}
                {listing.deposit && (
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Deposit</span>
                    <span className={styles.detailValue}>KES {Number(listing.deposit).toLocaleString()}</span>
                  </div>
                )}
                {listing.size_sqft && (
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Size</span>
                    <span className={styles.detailValue}>{listing.size_sqft} sq ft</span>
                  </div>
                )}
                {listing.floor_number && (
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Floor</span>
                    <span className={styles.detailValue}>{listing.floor_number}{listing.total_floors ? ` of ${listing.total_floors}` : ''}</span>
                  </div>
                )}
                {listing.available_from && (
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Available From</span>
                    <span className={styles.detailValue}>{new Date(listing.available_from).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Posted</span>
                  <span className={styles.detailValue}>{new Date(listing.created_at).toLocaleDateString('en-KE')}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Views</span>
                  <span className={styles.detailValue}>👁 {listing.views}</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className={styles.section}>
              <div className={styles.reviewsHeader}>
                <h2 className={styles.sectionTitle}>
                  Reviews {listing.review_count > 0 && <span>({listing.review_count})</span>}
                </h2>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowReview(!showReview)}>
                  ✍ Write Review
                </button>
              </div>

              {showReview && (
                <form className={styles.reviewForm} onSubmit={handleReview}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      className="form-control"
                      value={review.reviewer_name}
                      onChange={e => setReview(r => ({ ...r, reviewer_name: e.target.value }))}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <div className={styles.starSelect}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`${styles.starBtn} ${review.rating >= s ? styles.starActive : ''}`}
                          onClick={() => setReview(r => ({ ...r, rating: s }))}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea
                      className="form-control"
                      value={review.comment}
                      onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                      placeholder="Share your experience..."
                      rows={3}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowReview(false)}>Cancel</button>
                  </div>
                </form>
              )}

              {listing.reviews && listing.reviews.length > 0 ? (
                <div className={styles.reviewsList}>
                  {listing.reviews.map(r => (
                    <div key={r.id} className={styles.reviewItem}>
                      <div className={styles.reviewTop}>
                        <div className={styles.reviewAvatar}>{r.reviewer_name[0]}</div>
                        <div>
                          <strong>{r.reviewer_name}</strong>
                          <div className={styles.reviewStars}>
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </div>
                        </div>
                        <span className={styles.reviewDate}>{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={styles.rightCol}>
            <div className={styles.priceCard}>
              <div className={styles.priceTag}>
                KES {Number(listing.price).toLocaleString()}
                <span>/month</span>
              </div>

              {listing.deposit && (
                <div className={styles.depositInfo}>
                  Deposit: KES {Number(listing.deposit).toLocaleString()}
                </div>
              )}

              <div className={styles.badges}>
                <span className="badge badge-primary">{TYPE_LABELS[listing.property_type]}</span>
                {listing.featured && <span className="badge badge-warning">⭐ Featured</span>}
              </div>

              {avgRating > 0 && (
                <div className={styles.ratingRow}>
                  <div style={{ color: '#F59E0B', fontSize: '1rem' }}>
                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                  </div>
                  <span>{avgRating.toFixed(1)} ({listing.review_count} reviews)</span>
                </div>
              )}

              <div className={styles.locationInfo}>
                <span>📍</span>
                <span>{listing.sub_location ? `${listing.sub_location}, ` : ''}{listing.location}</span>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowInquiry(true)}>
                💬 Send Inquiry
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                onClick={toggleFavorite}
              >
                {favorited ? '❤️ Remove Favorite' : '🤍 Save to Favorites'}
              </button>

              {listing.contact_phone && (
                <a href={`tel:${listing.contact_phone}`} className="btn btn-dark" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
                  📞 Call {listing.contact_phone}
                </a>
              )}
              {listing.contact_phone && (
                <a
                  href={`https://wa.me/${listing.contact_phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 10, background: '#25D366', color: 'white' }}
                >
                  💬 WhatsApp Landlord
                </a>
              )}
            </div>

            {/* Landlord Info */}
            <div className={styles.landlordCard}>
              <h4 className={styles.landlordCardTitle}>About the Landlord</h4>
              <div className={styles.landlordProfile}>
                <div className={styles.landlordBigAvatar}>
                  {listing.landlord_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <strong>{listing.landlord_name}</strong>
                  <p>{listing.landlord_location}</p>
                </div>
              </div>
              {listing.landlord_phone && (
                <div className={styles.contactRow}>
                  <span>📞</span>
                  <span>{listing.landlord_phone}</span>
                </div>
              )}
            </div>

            {/* Share */}
            <div className={styles.shareCard}>
              <h4>Share This Listing</h4>
              <div className={styles.shareBtns}>
                <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }} className={styles.shareBtn}>
                  🔗 Copy Link
                </button>
                <a href={`https://twitter.com/intent/tweet?text=Check out this house in Nairobi!&url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                  🐦 Twitter
                </a>
                <a href={`https://wa.me/?text=Check out this house in Nairobi! ${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className={styles.modal} onClick={() => setShowInquiry(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Send Inquiry</h3>
              <button className={styles.modalClose} onClick={() => setShowInquiry(false)}>✕</button>
            </div>
            <form onSubmit={handleInquiry} className={styles.modalForm}>
              <div className="form-group">
                <label>Your Name *</label>
                <input className="form-control" value={inquiry.name} onChange={e => setInquiry(i => ({ ...i, name: e.target.value }))} placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label>Your Phone *</label>
                <input className="form-control" value={inquiry.phone} onChange={e => setInquiry(i => ({ ...i, phone: e.target.value }))} placeholder="e.g. 0712345678" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" value={inquiry.message} onChange={e => setInquiry(i => ({ ...i, message: e.target.value }))} placeholder="Hi, I'm interested in this property..." rows={4} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submittingInquiry}>
                {submittingInquiry ? 'Sending...' : '📨 Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
