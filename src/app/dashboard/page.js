'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { landlordAPI } from '../../utils/api';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { landlord, loading: authLoading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !landlord) {
      router.push('/auth/login');
      return;
    }
    if (landlord) fetchData();
  }, [landlord, authLoading]);

  const fetchData = async () => {
    try {
      const data = await landlordAPI.getListings();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return (
    <div className={styles.loading}>
      <div className="spinner" />
    </div>
  );

  const active = listings.filter(l => l.status === 'active').length;
  const pending = listings.filter(l => l.status === 'pending').length;
  const totalViews = listings.reduce((a, l) => a + (l.views || 0), 0);
  const totalRevenue = listings.filter(l => l.payment_status === 'paid').length * 300;

  return (
    <div className={styles.dashPage}>
      <div className={styles.dashHeader}>
        <div className="container">
          <div className={styles.dashWelcome}>
            <div className={styles.dashAvatar}>
              {landlord?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className={styles.dashTitle}>Welcome back, {landlord?.name?.split(' ')[0]}!</h1>
              <p className={styles.dashSubtitle}>📍 {landlord?.location} • Landlord since {new Date(landlord?.created_at || Date.now()).getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏠</div>
            <div className={styles.statNum}>{listings.length}</div>
            <div className={styles.statLabel}>Total Listings</div>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statNum}>{active}</div>
            <div className={styles.statLabel}>Active Listings</div>
          </div>
          <div className={`${styles.statCard} ${styles.statYellow}`}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statNum}>{pending}</div>
            <div className={styles.statLabel}>Pending Payment</div>
          </div>
          <div className={`${styles.statCard} ${styles.statBlue}`}>
            <div className={styles.statIcon}>👁</div>
            <div className={styles.statNum}>{totalViews}</div>
            <div className={styles.statLabel}>Total Views</div>
          </div>
          <div className={`${styles.statCard} ${styles.statPrimary}`}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statNum}>KES {totalRevenue.toLocaleString()}</div>
            <div className={styles.statLabel}>Paid in Listing Fees</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <Link href="/dashboard/post" className={styles.actionCard}>
            <div className={styles.actionIcon}>➕</div>
            <div>
              <strong>Post New Listing</strong>
              <p>Add a new property for KES 300</p>
            </div>
          </Link>
          <Link href="/dashboard/listings" className={styles.actionCard}>
            <div className={styles.actionIcon}>📋</div>
            <div>
              <strong>Manage Listings</strong>
              <p>View and edit your properties</p>
            </div>
          </Link>
          <Link href="/dashboard/profile" className={styles.actionCard}>
            <div className={styles.actionIcon}>👤</div>
            <div>
              <strong>Edit Profile</strong>
              <p>Update your information</p>
            </div>
          </Link>
          <Link href="/listings" className={styles.actionCard}>
            <div className={styles.actionIcon}>🔍</div>
            <div>
              <strong>Browse Listings</strong>
              <p>See all active properties</p>
            </div>
          </Link>
        </div>

        {/* Recent Listings */}
        <div className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h2>Recent Listings</h2>
            <Link href="/dashboard/listings" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {listings.length === 0 ? (
            <div className={styles.emptyDash}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏚</div>
              <h3>No listings yet</h3>
              <p>Start by posting your first property!</p>
              <Link href="/dashboard/post" className="btn btn-primary" style={{ marginTop: '16px' }}>
                ➕ Post Your First Listing
              </Link>
            </div>
          ) : (
            <div className={styles.recentList}>
              {listings.slice(0, 5).map(listing => (
                <div key={listing.id} className={styles.recentItem}>
                  <div className={styles.recentThumb}>
                    {listing.images?.[0] ? (
                      <img src={`http://localhost:5000${listing.images[0]}`} alt={listing.title} />
                    ) : (
                      <span>🏠</span>
                    )}
                  </div>
                  <div className={styles.recentInfo}>
                    <strong>{listing.title}</strong>
                    <p>📍 {listing.location} • KES {Number(listing.price).toLocaleString()}/mo</p>
                  </div>
                  <div className={styles.recentMeta}>
                    <span className={`badge ${listing.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {listing.status}
                    </span>
                    <span className={styles.viewsCount}>👁 {listing.views || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
