'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { listingsAPI } from '../../utils/api';
import PropertyCard from '../../components/PropertyCard';
import styles from './listings.module.css';

const PROPERTY_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Bedsitter', value: 'bedsitter' },
  { label: 'Single Room', value: 'single_room' },
  { label: 'One Bedroom', value: 'one_bedroom' },
  { label: 'Two Bedroom', value: 'two_bedroom' },
  { label: 'Three Bedroom', value: 'three_bedroom' }
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' }
];

const NAIROBI_LOCATIONS = [
  'Westlands', 'Kilimani', 'Kasarani', 'Embakasi', 'Langata',
  'Karen', 'Kileleshwa', 'Lavington', 'South B', 'South C',
  'Thika Road', 'Ruaka', 'Rongai', 'Ngong Road', 'Upperhill',
  'Gigiri', 'Runda', 'Muthaiga', 'Spring Valley', 'Parklands'
];

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    property_type: searchParams.get('property_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.property_type) params.property_type = filters.property_type;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      params.sort = filters.sort;
      params.page = filters.page;
      params.limit = 12;

      const data = await listingsAPI.getAll(params);
      setListings(data.listings || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ location: '', property_type: '', min_price: '', max_price: '', sort: 'newest', page: 1 });
  };

  const hasActiveFilters = filters.location || filters.property_type || filters.min_price || filters.max_price;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Browse Houses in Nairobi</h1>
          <p className={styles.pageSubtitle}>
            {total} {total === 1 ? 'listing' : 'listings'} available
            {filters.location ? ` in ${filters.location}` : ''}
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className={styles.clearBtn} onClick={clearFilters}>Clear All</button>
              )}
            </div>

            {/* Property Type */}
            <div className={styles.filterSection}>
              <h4>Property Type</h4>
              <div className={styles.typeOptions}>
                {PROPERTY_TYPES.map(type => (
                  <label key={type.value} className={styles.radioOption}>
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={filters.property_type === type.value}
                      onChange={() => updateFilter('property_type', type.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className={styles.filterSection}>
              <h4>Location</h4>
              <input
                type="text"
                className="form-control"
                placeholder="Search location..."
                value={filters.location}
                onChange={e => updateFilter('location', e.target.value)}
              />
              <div className={styles.locationChips}>
                {NAIROBI_LOCATIONS.slice(0, 8).map(loc => (
                  <button
                    key={loc}
                    className={`${styles.locationChip} ${filters.location === loc ? styles.activeChip : ''}`}
                    onClick={() => updateFilter('location', filters.location === loc ? '' : loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className={styles.filterSection}>
              <h4>Price Range (KES/month)</h4>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min price"
                  value={filters.min_price}
                  onChange={e => updateFilter('min_price', e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max price"
                  value={filters.max_price}
                  onChange={e => updateFilter('max_price', e.target.value)}
                />
              </div>
              <div className={styles.pricePresets}>
                {[
                  { label: 'Under 10K', min: '', max: 10000 },
                  { label: '10K–20K', min: 10000, max: 20000 },
                  { label: '20K–40K', min: 20000, max: 40000 },
                  { label: '40K+', min: 40000, max: '' }
                ].map(p => (
                  <button
                    key={p.label}
                    className={styles.pricePreset}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, min_price: String(p.min), max_price: String(p.max), page: 1 }));
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className={styles.main}>
            <div className={styles.toolbar}>
              <button className={styles.filterToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? '✕ Close' : '☰ Filters'}
                {hasActiveFilters && <span className={styles.filterDot} />}
              </button>
              <div className={styles.sortWrap}>
                <span>Sort by:</span>
                <select
                  className="form-control"
                  value={filters.sort}
                  onChange={e => updateFilter('sort', e.target.value)}
                  style={{ width: 'auto' }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
              <div className={styles.activeTags}>
                {filters.property_type && (
                  <span className={styles.activeTag}>
                    {PROPERTY_TYPES.find(t => t.value === filters.property_type)?.label}
                    <button onClick={() => updateFilter('property_type', '')}>✕</button>
                  </span>
                )}
                {filters.location && (
                  <span className={styles.activeTag}>
                    📍 {filters.location}
                    <button onClick={() => updateFilter('location', '')}>✕</button>
                  </span>
                )}
                {(filters.min_price || filters.max_price) && (
                  <span className={styles.activeTag}>
                    KES {filters.min_price || '0'} – {filters.max_price || '∞'}
                    <button onClick={() => { updateFilter('min_price', ''); updateFilter('max_price', ''); }}>✕</button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className={styles.loadingWrap}>
                <div className="spinner" />
                <p>Finding houses...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏚</div>
                <h3>No listings found</h3>
                <p>Try adjusting your filters or search a different area.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {listings.map(listing => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageBtn}
                      disabled={filters.page <= 1}
                      onClick={() => updateFilter('page', filters.page - 1)}
                    >
                      ← Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) page = i + 1;
                      else if (filters.page <= 3) page = i + 1;
                      else if (filters.page >= totalPages - 2) page = totalPages - 4 + i;
                      else page = filters.page - 2 + i;
                      return (
                        <button
                          key={page}
                          className={`${styles.pageBtn} ${filters.page === page ? styles.activePage : ''}`}
                          onClick={() => updateFilter('page', page)}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      className={styles.pageBtn}
                      disabled={filters.page >= totalPages}
                      onClick={() => updateFilter('page', filters.page + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div style={{padding:'80px', textAlign:'center'}}><div className="spinner" style={{margin:'0 auto'}} /></div>}>
      <ListingsContent />
    </Suspense>
  );
}
