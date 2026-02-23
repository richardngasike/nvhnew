'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PropertyCard.module.css';

const TYPE_LABELS = {
  bedsitter: 'Bedsitter',
  single_room: 'Single Room',
  one_bedroom: '1 Bedroom',
  two_bedroom: '2 Bedroom',
  three_bedroom: '3 Bedroom',
};

const AMENITY_ICONS = {
  wifi: '📶',
  parking: '🅿️',
  security: '🔒',
  water: '💧',
  electricity: '⚡',
  furnished: '🛋️',
  gym: '💪',
  pool: '🏊',
  garden: '🌿',
  backup: '🔋',
};

export default function PropertyCard({ listing }) {
  // Favorites state
  const [favorited, setFavorited] = useState(() => {
    if (typeof window !== 'undefined') {
      const favs = JSON.parse(localStorage.getItem('nhv_favorites') || '[]');
      return favs.includes(listing.id);
    }
    return false;
  });

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('nhv_favorites') || '[]');
    const newFavs = favorited
      ? favs.filter((id) => id !== listing.id)
      : [...favs, listing.id];
    localStorage.setItem('nhv_favorites', JSON.stringify(newFavs));
    setFavorited(!favorited);
  };

  // Determine image URL
  const primaryImage = listing.images?.[0];
  const imageUrl = primaryImage
    ? listing._isDemo
      ? primaryImage // demo images from public/
      : `http://localhost:5000${primaryImage}` // backend uploaded images
    : null;

  const avgRating = parseFloat(listing.avg_rating || 0);

  return (
    <Link href={`/listings/${listing.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            className={styles.image}
            width={400}
            height={250}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.imagePlaceholder}>🏠</div>
        )}

        <div className={styles.typeBadge}>
          {TYPE_LABELS[listing.property_type] || listing.property_type}
        </div>

        <button
          className={styles.favoriteBtn}
          onClick={toggleFavorite}
          aria-label={favorited ? 'Remove favorite' : 'Add favorite'}
        >
          {favorited ? '❤️' : '🤍'}
        </button>

        {listing.views > 0 && (
          <div className={styles.viewCount}>👁 {listing.views}</div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.price}>
          KES {Number(listing.price).toLocaleString()}
          <sub> /month</sub>
        </div>

        <h3 className={styles.title}>{listing.title}</h3>

        <div className={styles.location}>
          <span>📍</span>
          <span>
            {listing.sub_location ? `${listing.sub_location}, ` : ''}
            {listing.location}
          </span>
        </div>

        {listing.amenities && listing.amenities.length > 0 && (
          <div className={styles.amenities}>
            {listing.amenities.slice(0, 4).map((a, i) => (
              <span key={i} className={styles.amenityPill}>
                {AMENITY_ICONS[a.toLowerCase()] || '•'} {a}
              </span>
            ))}
            {listing.amenities.length > 4 && (
              <span className={styles.amenityPill}>
                +{listing.amenities.length - 4}
              </span>
            )}
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.landlordInfo}>
            <div className={styles.avatar}>
              {listing.landlord_name?.[0]?.toUpperCase() || 'L'}
            </div>
            <span className={styles.landlordName}>{listing.landlord_name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {avgRating > 0 && (
              <div className={styles.rating}>⭐ {avgRating.toFixed(1)}</div>
            )}
            <span className={styles.viewBtn}>View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}