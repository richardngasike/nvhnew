'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/Toast';
import styles from '../auth.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone || !form.password) return setError('Phone and password required');

    setLoading(true);
    try {
      await login(form.phone, form.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      setError(err.error || 'Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <span className={styles.icon}>🔑</span>
        </div>
        <h1 className={styles.authTitle}>Landlord Login</h1>
        <p className={styles.authSubtitle}>Sign in to manage your property listings</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              className="form-control"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. 0712345678"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div className={styles.passwordWrap}>
              <input
                type={showPass ? 'text' : 'password'}
                className="form-control"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter your password"
                required
              />
              <button type="button" className={styles.passwordToggle} onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.authBtn} disabled={loading}>
            {loading ? '⏳ Logging in...' : '🔑 Login'}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Don't have an account? <Link href="/auth/register">Register as Landlord</Link>
        </p>
      </div>
    </div>
  );
}
