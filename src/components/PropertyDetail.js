'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './PropertyDetail.module.css';

export default function PropertyDetail({ listing }) {
  // Combine API images + dummy if demo
  const images = listing._isDemo
    ? listing.images.concat([
        '/demo/img1.jpeg',
        '/demo/img2.jpeg',
        '/demo/img3.jpeg',
        '/demo/img4.jpeg',
        '/demo/img5.jpeg',
      ])
    : listing.images.map(img => `http://localhost:5000${img}`);

  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className={styles.container}>
      <h1>{listing.title}</h1>
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          <Image
            src={mainImage}
            alt={listing.title}
            width={800}
            height={500}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.thumbnails}>
          {images.map((img, i) => (
            <div
              key={i}
              className={styles.thumbnail}
              onClick={() => setMainImage(img)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i}`}
                width={100}
                height={75}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.info}>
        <p>{listing.description}</p>
        <p>Price: KES {listing.price.toLocaleString()} / month</p>
        <p>Location: {listing.sub_location}, {listing.location}</p>
        <p>Landlord: {listing.landlord_name}</p>
      </div>
    </div>
  );
}