import Link from 'next/link';
import styles from './about.module.css';

export const metadata = {
  title: 'About | Nairobi Vacant Houses',
  description: 'Learn how Nairobi Vacant Houses works for landlords and tenants'
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>About Nairobi Vacant Houses</h1>
          <p className={styles.heroDesc}>
            We're making it easier for Nairobians to find and list vacant properties.
            Connecting landlords and tenants directly, transparently and affordably.
          </p>
        </div>
      </section>

      {/* How it Works - Tenants */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '8px' }}>How It Works for Tenants</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '48px' }}>Finding your next home is simple</p>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', icon: '🔍', title: 'Browse Listings', desc: 'Search through hundreds of verified properties across Nairobi. Filter by area, price, and type.' },
              { step: '02', icon: '📸', title: 'View Photos & Details', desc: 'See real photos, read amenities, floor details, and all the information you need.' },
              { step: '03', icon: '💬', title: 'Contact Landlord', desc: 'Send an inquiry or call the landlord directly. No middlemen, no extra fees.' },
              { step: '04', icon: '🏠', title: 'Move In', desc: 'Agree on terms with the landlord and move into your new home.' }
            ].map(s => (
              <div key={s.step} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.step}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Landlords */}
      <section className={styles.landlordSection}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '8px', color: 'white' }}>How It Works for Landlords</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '48px', color: 'rgba(255,255,255,0.65)' }}>Start getting tenants today</p>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', icon: '👤', title: 'Create Account', desc: 'Register with your name, location, and phone number. Free to sign up.' },
              { step: '02', icon: '📝', title: 'Fill Property Details', desc: 'Add title, location, amenities, price, and up to 5 property photos.' },
              { step: '03', icon: '💳', title: 'Pay KES 300 via M-Pesa', desc: 'A one-time listing fee of KES 300 paid securely via M-Pesa STK Push.' },
              { step: '04', icon: '✅', title: 'Go Live Instantly', desc: 'Your listing is published immediately after payment confirmation.' }
            ].map(s => (
              <div key={s.step} className={`${styles.stepCard} ${styles.stepCardDark}`}>
                <div className={styles.stepNum}>{s.step}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              🏠 Start Listing — KES 300 per post
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>Simple Pricing</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingIcon}>👤</div>
              <h3>For Tenants</h3>
              <div className={styles.priceFree}>FREE</div>
              <ul className={styles.priceFeatures}>
                <li>✅ Browse all listings</li>
                <li>✅ Filter by area & price</li>
                <li>✅ View full details & photos</li>
                <li>✅ Send inquiries to landlords</li>
                <li>✅ Save favorites</li>
                <li>✅ No registration required</li>
              </ul>
              <Link href="/listings" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Browse Houses →</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
              <div className={styles.pricingBadge}>Most Popular</div>
              <div className={styles.pricingIcon}>🏠</div>
              <h3>For Landlords</h3>
              <div className={styles.priceAmount}>KES 300 <span>per listing</span></div>
              <ul className={styles.priceFeatures}>
                <li>✅ Free account creation</li>
                <li>✅ Pay per listing (KES 300)</li>
                <li>✅ Up to 5 photos per listing</li>
                <li>✅ Listed to thousands of tenants</li>
                <li>✅ Receive direct inquiries</li>
                <li>✅ Manage all listings in dashboard</li>
                <li>✅ Secure M-Pesa payment</li>
              </ul>
              <Link href="/auth/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            {[
              { q: 'Is browsing listings free?', a: 'Yes! Tenants can browse, filter, and contact landlords for free with no registration required.' },
              { q: 'How does M-Pesa payment work?', a: 'When you submit a listing, you enter your Safaricom number and receive an STK push prompt. Enter your PIN to complete the KES 300 payment.' },
              { q: 'How long does a listing stay up?', a: 'Listings stay active until you delete them. You can manage all your listings from your dashboard.' },
              { q: 'Can I edit my listing after posting?', a: 'Currently you can delete and repost listings. Editing feature coming soon.' },
              { q: 'Is my payment secure?', a: 'Yes, all payments are processed by Safaricom M-Pesa, Kenya\'s leading mobile money service.' },
              { q: 'Can I post multiple listings?', a: 'Yes! Each listing requires a separate KES 300 payment, but you can post unlimited listings from your account.' }
            ].map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
