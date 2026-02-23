import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span>🏠</span>
              <div>
                <strong>Nairobi Vacant Houses</strong>
                <p>Find Your Perfect Home</p>
              </div>
            </div>
            <p className={styles.tagline}>
              Connecting landlords and tenants across Nairobi with ease.
              Your next home is just a click away.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="WhatsApp">💬</a>
              <a href="#" aria-label="Instagram">📸</a>
            </div>
          </div>

          <div className={styles.links}>
            <h4>Browse</h4>
            <ul>
              <li><Link href="/listings?property_type=bedsitter">Bedsitters</Link></li>
              <li><Link href="/listings?property_type=single_room">Single Rooms</Link></li>
              <li><Link href="/listings?property_type=one_bedroom">One Bedroom</Link></li>
              <li><Link href="/listings?property_type=two_bedroom">Two Bedroom</Link></li>
              <li><Link href="/listings?property_type=three_bedroom">Three Bedroom</Link></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Locations</h4>
            <ul>
              <li><Link href="/listings?location=Westlands">Westlands</Link></li>
              <li><Link href="/listings?location=Kilimani">Kilimani</Link></li>
              <li><Link href="/listings?location=Kasarani">Kasarani</Link></li>
              <li><Link href="/listings?location=Embakasi">Embakasi</Link></li>
              <li><Link href="/listings?location=Langata">Langata</Link></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Landlords</h4>
            <ul>
              <li><Link href="/auth/register">Create Account</Link></li>
              <li><Link href="/auth/login">Login</Link></li>
              <li><Link href="/dashboard/post">Post a House</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/about">How It Works</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Nairobi Vacant Houses. All rights reserved.</p>
          <p>Built with ❤️ for Nairobi residents</p>
        </div>
      </div>
    </footer>
  );
}
