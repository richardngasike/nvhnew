'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { landlordAPI } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import styles from './profile.module.css';

const LOCATIONS = [
  'Westlands', 'Kilimani', 'Kasarani', 'Embakasi', 'Langata',
  'Karen', 'Kileleshwa', 'Lavington', 'South B', 'South C',
  'Thika Road', 'Ruaka', 'Rongai', 'Ngong Road', 'Upperhill', 'Other'
];

export default function ProfilePage() {
  const { landlord, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', location: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !landlord) router.push('/auth/login');
    if (landlord) setForm({ name: landlord.name || '', location: landlord.location || '', email: landlord.email || '' });
  }, [landlord, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await landlordAPI.updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
      <div className="spinner" />
    </div>
  );

  if (!landlord) return null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>Manage your landlord account</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Profile Summary Card */}
          <div className={styles.summaryCard}>
            <div className={styles.avatarBig}>
              {landlord.name?.[0]?.toUpperCase()}
            </div>
            <h2 className={styles.summaryName}>{landlord.name}</h2>
            <p className={styles.summaryLocation}>📍 {landlord.location}</p>
            <div className={styles.summaryStats}>
              <div>
                <strong>{landlord.total_listings || 0}</strong>
                <span>Listings</span>
              </div>
              <div>
                <strong>{parseFloat(landlord.rating || 0).toFixed(1)}</strong>
                <span>Rating</span>
              </div>
            </div>
            <div className={styles.memberSince}>
              Member since {new Date(landlord.created_at || Date.now()).getFullYear()}
            </div>

            <div className={styles.quickInfo}>
              <div className={styles.infoRow}>
                <span>📞</span>
                <span>{landlord.phone}</span>
              </div>
              {landlord.email && (
                <div className={styles.infoRow}>
                  <span>📧</span>
                  <span>{landlord.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Edit Information</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <select
                  className="form-control"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  required
                >
                  <option value="">Select area</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className="form-control"
                  value={landlord.phone}
                  disabled
                  style={{ background: 'var(--bg)', cursor: 'not-allowed', opacity: 0.7 }}
                />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  Phone number cannot be changed
                </small>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={loading}>
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </form>

            <div className={styles.dangerZone}>
              <h4>Account Actions</h4>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    router.push('/auth/login');
                  }
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
