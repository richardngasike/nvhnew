'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin, FiHome, FiUsers, FiCheckCircle, FiCamera, FiPhone, FiLock, FiDollarSign } from 'react-icons/fi';
import { listingsAPI } from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import styles from './page.module.css';

const PROPERTY_TYPES = [
  { label: 'All Types',   value: '' },
  { label: 'Bedsitter',   value: 'bedsitter' },
  { label: 'Single Room', value: 'single_room' },
  { label: '1 Bedroom',   value: 'one_bedroom' },
  { label: '2 Bedroom',   value: 'two_bedroom' },
  { label: '3 Bedroom',   value: 'three_bedroom' },
];

const FEATURES = [
  { icon: FiCheckCircle, title: 'Verified Listings',  desc: 'All listings are verified through M-Pesa payment ensuring genuine landlords.' },
  { icon: FiCamera,      title: 'Real Photos',        desc: 'View up to 5 real photos of each property before making a decision.' },
  { icon: FiPhone,       title: 'Direct Contact',     desc: 'Contact landlords directly via phone — no middlemen involved.' },
  { icon: FiLock,        title: 'Secure Platform',    desc: 'Your information is protected with industry-standard security.' },
  { icon: FiMapPin,      title: 'Location-Based',     desc: 'Filter by specific Nairobi neighbourhoods to find exactly what you need.' },
  { icon: FiDollarSign,  title: 'Best Prices',        desc: 'Compare prices across different areas to find the best deal.' },
];

export default function Home() {
  const router = useRouter();
  const [search, setSearch]       = useState('');
  const [activeType, setActiveType] = useState('');
  const [listings, setListings]   = useState([]);
  const [stats, setStats]         = useState({ active_listings: 0, total_landlords: 0, locations: 0 });
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [listingsData, statsData] = await Promise.all([
        listingsAPI.getAll({ limit: 6, sort: 'newest' }),
        listingsAPI.getStats(),
      ]);
      setListings(listingsData.listings || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search)     params.set('location',      search);
    if (activeType) params.set('property_type', activeType);
    router.push(`/listings?${params.toString()}`);
  };

  const handleTypeFilter = (type) => {
    setActiveType(type);
    if (type) router.push(`/listings?property_type=${type}`);
  };

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>

        {/* full-bleed background image */}
        <div className={styles.heroBgImage}>
          <Image
            src="/herobg.jpeg"
            alt="Nairobi skyline background"
            fill
            priority
            quality={85}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        {/* dark overlay so text stays readable */}
        <div className={styles.heroOverlay} />

        {/* animated soft-glow blobs (optional accent on top of photo) */}
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBubble} />
          <div className={styles.heroBubble} />
          <div className={styles.heroBubble} />
        </div>

        <div className="container">
          <div className={styles.heroContent}>

            <div className={styles.heroEyebrow}>
              <FiMapPin size={14} strokeWidth={2.5} />
              Nairobi, Kenya
            </div>

            <h1 className={styles.heroTitle}>
              Find Your Perfect <span>Home</span> in Nairobi
            </h1>

            <p className={styles.heroDesc}>
              Browse hundreds of verified vacant houses across Nairobi.
              From cosy bedsitters to spacious family homes — your next home is here.
            </p>

            <form className={styles.heroSearch} onSubmit={handleSearch}>
              <FiSearch className={styles.searchIcon} size={20} strokeWidth={2} />
              <input
                type="text"
                className={styles.heroSearchInput}
                placeholder="Search by location (e.g. Westlands, Kilimani, Kasarani)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className={styles.heroSearchBtn}>
                Search Houses
              </button>
            </form>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <strong>{stats.active_listings}+</strong>
                <span>Active Listings</span>
              </div>
              <div className={styles.heroStat}>
                <strong>{stats.total_landlords}+</strong>
                <span>Landlords</span>
              </div>
              <div className={styles.heroStat}>
                <strong>{stats.locations}+</strong>
                <span>Locations</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Quick Filters ────────────────────────────────────── */}
      <section className={styles.quickFilters}>
        <div className="container">
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Browse by type:</span>
            {PROPERTY_TYPES.map(type => (
              <button
                key={type.value}
                className={`${styles.filterChip} ${activeType === type.value ? styles.active : ''}`}
                onClick={() => handleTypeFilter(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Listings ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Latest Listings</h2>
              <p className="section-subtitle">Browse the most recently posted houses</p>
            </div>
            <Link href="/listings" className="btn btn-secondary btn-sm">
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className={styles.listingsGrid}>
              {listings.length > 0 ? (
                listings.map(listing => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FiHome size={48} strokeWidth={1.2} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
                  <h3>No listings yet</h3>
                  <p>Be the first to post a house!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────── */}
      <section className={styles.features}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h2 className="section-title" style={{ color: 'white' }}>
              Why Use Nairobi Vacant Houses?
            </h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>
              The most trusted platform for Nairobi rentals
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Icon size={28} strokeWidth={1.8} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Are You a Landlord?</h2>
          <p className={styles.ctaDesc}>
            Post your vacant houses and reach thousands of tenants in Nairobi.
            Just pay KES&nbsp;300 via M-Pesa to list your property.
          </p>
          <div className={styles.ctaBtns}>
            <Link href="/auth/register" className={styles.ctaBtnWhite}>
              <FiHome size={18} strokeWidth={2} />
              Post a House — KES 300
            </Link>
            <Link href="/listings" className={styles.ctaBtnOutline}>
              Browse Listings →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}