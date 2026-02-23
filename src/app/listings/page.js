'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiFilter, FiX, FiMapPin, FiHome } from 'react-icons/fi';
import { listingsAPI } from '../../utils/api';
import PropertyCard from '../../components/PropertyCard';
import styles from './listings.module.css';

/* ─── Dummy listing shown when DB is empty ───────────────────────
   Images must exist at: frontend/public/demo/img1.jpg … img5.jpg
   ─────────────────────────────────────────────────────────────── */
const DUMMY_LISTING = {
  id: 'demo-1',
  title: 'Modern 1 Bedroom Apartment – Kilimani',
  description:
    'Spacious and fully-furnished one bedroom apartment in the heart of Kilimani. ' +
    'Enjoy stunning city views, 24-hour security, ample parking and reliable water supply. ' +
    'Walking distance to Yaya Centre and Junction Mall. Available immediately.',
  location: 'Kilimani',
  sub_location: 'Argwings Kodhek Road',
  property_type: 'one_bedroom',
  price: 28000,
  deposit: 56000,
  amenities: ['WiFi', 'Parking', 'Security', 'Water', 'Electricity', 'Furnished', 'Balcony', 'CCTV'],
  images: [
    '/demo/img1.jpeg',
    '/demo/img2.jpeg',
    '/demo/img3.jpeg',
    '/demo/img4.jpeg',
    '/demo/img5.jpeg',
  ],
  status: 'active',
  views: 124,
  contact_phone: '0700000000',
  available_from: new Date().toISOString(),
  floor_number: 3,
  size_sqft: 650,
  rating: 4.8,
  review_count: 7,
  landlord_name: 'Demo Landlord',
  created_at: new Date().toISOString(),
  _isDemo: true,  // flag so we can show a "demo" badge
};

const PROPERTY_TYPES = [
  { label: 'All Types',    value: '' },
  { label: 'Bedsitter',    value: 'bedsitter' },
  { label: 'Single Room',  value: 'single_room' },
  { label: 'One Bedroom',  value: 'one_bedroom' },
  { label: 'Two Bedroom',  value: 'two_bedroom' },
  { label: 'Three Bedroom',value: 'three_bedroom' },
];

const SORT_OPTIONS = [
  { label: 'Newest First',       value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular',       value: 'popular' },
];

const NAIROBI_LOCATIONS = [
  'Westlands','Kilimani','Kasarani','Embakasi','Langata',
  'Karen','Kileleshwa','Lavington','South B','South C',
  'Thika Road','Ruaka','Rongai','Ngong Road','Upperhill',
  'Gigiri','Runda','Muthaiga','Spring Valley','Parklands',
];

function ListingsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [listings,    setListings]   = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [total,       setTotal]      = useState(0);
  const [totalPages,  setTotalPages] = useState(1);
  const [showingDemo, setShowingDemo]= useState(false);

  const [filters, setFilters] = useState({
    location:      searchParams.get('location')      || '',
    property_type: searchParams.get('property_type') || '',
    min_price:     searchParams.get('min_price')     || '',
    max_price:     searchParams.get('max_price')     || '',
    sort:          searchParams.get('sort')          || 'newest',
    page:          Number(searchParams.get('page'))  || 1,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchListings(); }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { sort: filters.sort, page: filters.page, limit: 12 };
      if (filters.location)      params.location      = filters.location;
      if (filters.property_type) params.property_type = filters.property_type;
      if (filters.min_price)     params.min_price     = filters.min_price;
      if (filters.max_price)     params.max_price     = filters.max_price;

      const data = await listingsAPI.getAll(params);
      const real  = data.listings || [];

      if (real.length === 0 && !hasActiveFilters) {
        /* No real listings yet — show the demo so the page isn't blank */
        setListings([DUMMY_LISTING]);
        setTotal(1);
        setTotalPages(1);
        setShowingDemo(true);
      } else {
        setListings(real);
        setTotal(data.total       || 0);
        setTotalPages(data.totalPages || 1);
        setShowingDemo(false);
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      /* On error still show demo so page looks alive */
      setListings([DUMMY_LISTING]);
      setTotal(1);
      setTotalPages(1);
      setShowingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));

  const clearFilters = () =>
    setFilters({ location:'', property_type:'', min_price:'', max_price:'', sort:'newest', page:1 });

  const hasActiveFilters =
    !!(filters.location || filters.property_type || filters.min_price || filters.max_price);

  /* Label for results count */
  const countLabel = showingDemo
    ? 'Showing sample listing — be the first to post!'
    : `${total} ${total === 1 ? 'listing' : 'listings'} available${filters.location ? ` in ${filters.location}` : ''}`;

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Browse Houses in Nairobi</h1>
          <p className={styles.pageSubtitle}>{countLabel}</p>
        </div>
      </div>

      {/* ── Demo banner ── */}
      {showingDemo && (
        <div className={styles.demoBanner}>
          <div className="container">
            <FiHome size={16} strokeWidth={2} />
            <span>
              <strong>No listings posted yet.</strong> This is a sample listing showing how your property will look.{' '}
              <a href="/auth/register">Post your first house</a> for only KES 300 via M-Pesa.
            </span>
          </div>
        </div>
      )}

      <div className="container">
        <div className={styles.layout}>

          {/* ── Sidebar ── */}
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
                  { label: 'Under 10K', min: '',    max: 10000 },
                  { label: '10K–20K',   min: 10000, max: 20000 },
                  { label: '20K–40K',   min: 20000, max: 40000 },
                  { label: '40K+',      min: 40000, max: '' },
                ].map(p => (
                  <button
                    key={p.label}
                    className={styles.pricePreset}
                    onClick={() =>
                      setFilters(prev => ({
                        ...prev,
                        min_price: String(p.min),
                        max_price: String(p.max),
                        page: 1,
                      }))
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className={styles.main}>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button
                className={styles.filterToggle}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen
                  ? <><FiX size={15} /> Close</>
                  : <><FiFilter size={15} /> Filters</>
                }
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
                    <button onClick={() => updateFilter('property_type', '')}>
                      <FiX size={11} />
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className={styles.activeTag}>
                    <FiMapPin size={11} /> {filters.location}
                    <button onClick={() => updateFilter('location', '')}>
                      <FiX size={11} />
                    </button>
                  </span>
                )}
                {(filters.min_price || filters.max_price) && (
                  <span className={styles.activeTag}>
                    KES {filters.min_price || '0'} – {filters.max_price || '∞'}
                    <button onClick={() => {
                      updateFilter('min_price', '');
                      updateFilter('max_price', '');
                    }}>
                      <FiX size={11} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div className={styles.loadingWrap}>
                <div className="spinner" />
                <p>Finding houses...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className={styles.emptyState}>
                <FiHome size={52} strokeWidth={1.2} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
                <h3>No listings found</h3>
                <p>Try adjusting your filters or search a different area.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                {/* Demo badge row */}
                {showingDemo && (
                  <p className={styles.demoNote}>
                    Sample listing — post yours and it will appear here just like this.
                  </p>
                )}

                <div className={styles.grid}>
                  {listings.map(listing => (
                    <div key={listing.id} className={listing._isDemo ? styles.demoCardWrap : ''}>
                      {listing._isDemo && (
                        <div className={styles.demoBadge}>Sample</div>
                      )}
                      <PropertyCard listing={listing} />
                    </div>
                  ))}
                </div>

                {/* Pagination — hide for demo */}
                {!showingDemo && totalPages > 1 && (
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
                      if (totalPages <= 5)              page = i + 1;
                      else if (filters.page <= 3)       page = i + 1;
                      else if (filters.page >= totalPages - 2) page = totalPages - 4 + i;
                      else                              page = filters.page - 2 + i;
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
    <Suspense
      fallback={
        <div style={{ padding: '80px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}