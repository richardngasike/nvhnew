'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { landlordAPI, listingsAPI } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import styles from './listings.module.css';

const TYPE_LABELS = {
  bedsitter: 'Bedsitter', single_room: 'Single Room',
  one_bedroom: '1 Bedroom', two_bedroom: '2 Bedroom', three_bedroom: '3 Bedroom'
};

export default function MyListingsPage() {
  const { landlord, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!authLoading && !landlord) router.push('/auth/login');
    if (landlord) fetchListings();
  }, [landlord, authLoading]);

  const fetchListings = async () => {
    try {
      const data = await landlordAPI.getListings();
      setListings(data);
    } catch (err) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await listingsAPI.delete(id);
      setListings(l => l.filter(x => x.id !== id));
      toast.success('Listing deleted');
      setConfirmDelete(null);
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const handleActivate = async (id) => {
    try {
      await listingsAPI.activate(id);
      setListings(l => l.map(x => x.id === id ? { ...x, status: 'active', payment_status: 'paid' } : x));
      toast.success('Listing activated!');
    } catch (err) {
      toast.error('Failed to activate listing');
    }
  };

  if (authLoading || loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div>
              <h1 className={styles.title}>My Listings</h1>
              <p className={styles.subtitle}>{listings.length} total • {listings.filter(l => l.status === 'active').length} active</p>
            </div>
            <Link href="/dashboard/post" className="btn btn-primary">
              ➕ Post New Listing
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {listings.length === 0 ? (
          <div className={styles.empty}>
            <div>🏚</div>
            <h3>No listings yet</h3>
            <p>Post your first property to start getting inquiries</p>
            <Link href="/dashboard/post" className="btn btn-primary">Post Your First Listing</Link>
          </div>
        ) : (
          <div className={styles.listTable}>
            {listings.map(listing => (
              <div key={listing.id} className={styles.listItem}>
                <div className={styles.thumb}>
                  {listing.images?.[0] ? (
                    <img src={`http://localhost:5000${listing.images[0]}`} alt={listing.title} />
                  ) : (
                    <span>🏠</span>
                  )}
                </div>

                <div className={styles.info}>
                  <h3>{listing.title}</h3>
                  <p>📍 {listing.location} • {TYPE_LABELS[listing.property_type]} • KES {Number(listing.price).toLocaleString()}/mo</p>
                  <div className={styles.metaRow}>
                    <span className={`badge ${listing.status === 'active' ? 'badge-success' : listing.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {listing.status}
                    </span>
                    <span className={`badge ${listing.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      💳 {listing.payment_status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>👁 {listing.views || 0} views</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⭐ {parseFloat(listing.avg_rating || 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link href={`/listings/${listing.id}`} className="btn btn-secondary btn-sm">View</Link>
                  {listing.status === 'pending' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleActivate(listing.id)}>
                      ✅ Activate
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(listing.id)}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className={styles.modal} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Delete Listing?</h3>
            <p>This action cannot be undone. The listing will be permanently removed.</p>
            <div className={styles.modalActions}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>🗑 Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
