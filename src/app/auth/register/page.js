'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/Toast';
import styles from '../auth.module.css';

const NAIROBI_LOCATIONS = [
  'Westlands', 'Kilimani', 'Kasarani', 'Embakasi', 'Langata',
  'Karen', 'Kileleshwa', 'Lavington', 'South B', 'South C',
  'Thika Road', 'Ruaka', 'Rongai', 'Ngong Road', 'Upperhill',
  'Gigiri', 'Runda', 'Muthaiga', 'Spring Valley', 'Parklands', 'Other'
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({
    name: '', location: '', phone: '', email: '', password: '', confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.location || !form.phone || !form.password) {
      return setError('All required fields must be filled');
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (!/^(07|01)\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      return setError('Enter a valid Kenyan phone number (07XXXXXXXX or 01XXXXXXXX)');
    }

    setLoading(true);
    try {
      await register({ name: form.name, location: form.location, phone: form.phone, email: form.email, password: form.password });
      toast.success('Account created! Welcome to Nairobi Vacant Houses.');
      router.push('/dashboard');
    } catch (err) {
      setError(err.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <span className={styles.icon}>🏠</span>
        </div>
        <h1 className={styles.authTitle}>Create Landlord Account</h1>
        <p className={styles.authSubtitle}>Join and start listing your vacant properties today</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input className="form-control" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. John Kamau" required />
          </div>

          <div className="form-group">
            <label>Location in Nairobi *</label>
            <select className="form-control" value={form.location} onChange={e => update('location', e.target.value)} required>
              <option value="">Select your area</option>
              {NAIROBI_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className={styles.formRow}>
            <div className="form-group">
              <label>Phone Number *</label>
              <input className="form-control" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0712345678" required />
            </div>
            <div className="form-group">
              <label>Email (optional)</label>
              <input type="email" className="form-control" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" />
            </div>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div className={styles.passwordWrap}>
              <input
                type={showPass ? 'text' : 'password'}
                className="form-control"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="Min. 6 characters"
                required
              />
              <button type="button" className={styles.passwordToggle} onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type={showPass ? 'text' : 'password'}
              className="form-control"
              value={form.confirm}
              onChange={e => update('confirm', e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ℹ️ After creating your account, you'll need to pay <strong>KES 300 via M-Pesa</strong> to post each listing.
          </div>

          <button type="submit" className={styles.authBtn} disabled={loading}>
            {loading ? '⏳ Creating Account...' : '🏠 Create Account'}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Already have an account? <Link href="/auth/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
