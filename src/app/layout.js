import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastProvider from '../components/Toast';
import SkipLink from '../components/SkipLink';

/* ─────────────────────────────────────────────────────────────────
   ROOT METADATA  –  targets every high-volume Nairobi rental query
   ───────────────────────────────────────────────────────────────── */
export const metadata = {
  metadataBase: new URL('https://www.nairobivacanthouses.co.ke'),
  applicationName: 'Nairobi Vacant Houses',
  authors: [{ name: 'Nairobi Vacant Houses', url: 'https://www.nairobivacanthouses.co.ke' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  category: 'Real Estate',

  title: {
    default:
      'Nairobi Vacant Houses – Bedsitters, Single Rooms, 1, 2 & 3 Bedroom Houses for Rent in Nairobi',
    template: '%s | Nairobi Vacant Houses',
  },

  description:
    'Find verified vacant houses for rent in Nairobi. Browse bedsitters, single rooms, one bedroom, two bedroom and three bedroom apartments in Westlands, Kilimani, Kasarani, Pipeline, Embakasi, Karen, Langata, Githurai, Kahawa West, South B, South C, Ruaka, Rongai and more. Landlords post for only KES 300 via M-Pesa.',

  keywords: [
    'bedsitter for rent Nairobi',
    'bedsitter Nairobi',
    'bedsitter Westlands',
    'bedsitter Kilimani',
    'bedsitter Kasarani',
    'bedsitter Kahawa West',
    'bedsitter Githurai',
    'bedsitter Pipeline',
    'single room for rent Nairobi',
    'single room Nairobi',
    'one bedroom for rent Nairobi',
    '1 bedroom for rent Nairobi',
    'one bedroom Pipeline',
    'one bedroom Embakasi',
    'one bedroom Kasarani',
    'one bedroom Kilimani',
    'one bedroom Westlands',
    'two bedroom for rent Nairobi',
    '2 bedroom apartment Nairobi',
    'three bedroom for rent Nairobi',
    '3 bedroom house Nairobi',
    'cheap houses for rent Nairobi',
    'affordable houses Nairobi',
    'vacant houses Nairobi',
    'houses to let Nairobi',
    'apartments for rent Nairobi',
    'flats to let Nairobi',
    'furnished apartment Nairobi',
    'studio apartment Nairobi',
    'house for rent Westlands',
    'apartment Westlands Nairobi',
    'house for rent Kilimani',
    'apartment Kilimani Nairobi',
    'house for rent Kileleshwa',
    'house for rent Lavington',
    'house for rent Karen Nairobi',
    'house for rent Langata',
    'house for rent Gigiri',
    'house for rent Runda',
    'house for rent Muthaiga',
    'house for rent Spring Valley',
    'house for rent Parklands',
    'house for rent Upperhill',
    'house for rent South B Nairobi',
    'house for rent South C Nairobi',
    'house for rent Hurlingham',
    'house for rent Ngong Road',
    'house for rent Donholm',
    'house for rent Buruburu',
    'house for rent Imara Daima',
    'house for rent Fedha',
    'house for rent Kayole',
    'house for rent Kasarani Nairobi',
    'house for rent Kahawa West',
    'house for rent Kahawa Sukari',
    'house for rent Githurai',
    'house for rent Githurai 44',
    'house for rent Mwiki',
    'house for rent Mirema',
    'house for rent Roysambu',
    'house for rent Embakasi',
    'house for rent Pipeline Nairobi',
    'house for rent Tassia',
    'house for rent Komarock',
    'house for rent Umoja',
    'house for rent Dagoretti',
    'house for rent Kangemi',
    'house for rent Kawangware',
    'house for rent Ruaka',
    'house for rent Rongai',
    'house for rent Kitengela',
    'house for rent Syokimau',
    'house for rent Athi River',
    'house for rent Thika Road',
    'house for rent Kiambu Road',
    'house for rent Juja',
    'house for rent Ruiru',
    'post house for rent Nairobi',
    'list property Nairobi',
    'advertise house Kenya',
    'landlord Nairobi rental listing',
    'Nairobi property listing KES 300',
    'Kenya houses for rent',
    'Nairobi rental',
    'Nairobi real estate rent',
    'houses to rent Kenya',
    'rent apartment Nairobi',
    'NHC houses Nairobi',
    'Nairobi housing',
  ],

  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.nairobivacanthouses.co.ke',
    siteName: 'Nairobi Vacant Houses',
    title:
      'Nairobi Vacant Houses – Find Bedsitters, Single Rooms & Apartments for Rent in Nairobi',
    description:
      'Browse thousands of verified vacant houses in Nairobi. Bedsitters from KES 4,500, single rooms, 1-3 bedroom apartments in Westlands, Kilimani, Kasarani, Pipeline, Embakasi and all major estates.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nairobi Vacant Houses – Find Your Perfect Rental Home in Nairobi, Kenya',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@NairobiVacant',
    creator: '@NairobiVacant',
    title: 'Nairobi Vacant Houses – Bedsitters & Apartments for Rent',
    description:
      'Find cheap houses for rent in Nairobi – bedsitters, single rooms, 1, 2 and 3 bedroom apartments in all Nairobi estates. Post your listing for KES 300 via M-Pesa.',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN',
  },

  alternates: {
    canonical: 'https://www.nairobivacanthouses.co.ke',
    languages: {
      'en-KE': 'https://www.nairobivacanthouses.co.ke',
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },

  manifest: '/manifest.json',

  other: {
    'geo.region': 'KE-30',
    'geo.placename': 'Nairobi, Kenya',
    'geo.position': '-1.286389;36.817223',
    ICBM: '-1.286389, 36.817223',
    'format-detection': 'telephone=yes',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Nairobi Vacant Houses',
    'msapplication-TileColor': '#C8A96E',
    'theme-color': '#1A1A2E',
    rating: 'general',
    revisit: '3 days',
    language: 'English',
    country: 'Kenya',
  },
};

/* ─────────────────────────────────────────────────────────────────
   STRUCTURED DATA (JSON-LD)
   ───────────────────────────────────────────────────────────────── */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': 'https://www.nairobivacanthouses.co.ke/#organization',
  name: 'Nairobi Vacant Houses',
  url: 'https://www.nairobivacanthouses.co.ke',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.nairobivacanthouses.co.ke/logo.png',
    width: 300,
    height: 60,
  },
  image: 'https://www.nairobivacanthouses.co.ke/og-image.jpg',
  description:
    "Kenya's leading platform for vacant house rentals in Nairobi. Connecting landlords and tenants directly across all Nairobi estates.",
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.286389,
    longitude: 36.817223,
  },
  areaServed: [
    { '@type': 'City', name: 'Nairobi' },
    { '@type': 'Country', name: 'Kenya' },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English', 'Swahili'],
    areaServed: 'KE',
  },
  sameAs: [
    'https://www.facebook.com/nairobivacanthouses',
    'https://twitter.com/NairobiVacant',
    'https://www.instagram.com/nairobivacanthouses',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.nairobivacanthouses.co.ke/#website',
  url: 'https://www.nairobivacanthouses.co.ke',
  name: 'Nairobi Vacant Houses',
  description:
    'Find bedsitters, single rooms, one bedroom, two bedroom and three bedroom houses for rent in Nairobi, Kenya.',
  publisher: { '@id': 'https://www.nairobivacanthouses.co.ke/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate:
        'https://www.nairobivacanthouses.co.ke/listings?location={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-KE',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.nairobivacanthouses.co.ke',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Browse Listings',
      item: 'https://www.nairobivacanthouses.co.ke/listings',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can I find a bedsitter for rent in Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can browse all available bedsitters for rent in Nairobi on Nairobi Vacant Houses. We have listings in Westlands, Kilimani, Kasarani, Kahawa West, Githurai, Pipeline, Embakasi, and many more estates starting from as low as KES 5,000 per month.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a one bedroom house cost in Pipeline Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A one bedroom house in Pipeline, Embakasi Nairobi typically costs between KES 10,000 and KES 18,000 per month. Prices vary depending on the exact location, amenities, and finishing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest area to rent a house in Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some of the most affordable rental areas in Nairobi include Pipeline, Embakasi, Githurai, Kahawa West, Kasarani, Kayole, Umoja, Mwiki and Ruaka. Single rooms in these areas start from KES 3,500 to KES 8,000 per month.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I list my house on Nairobi Vacant Houses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Create a free landlord account, fill in your property details, upload up to 5 photos, then pay a one-time listing fee of KES 300 via M-Pesa STK Push. Your listing goes live immediately after payment confirmation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I find furnished apartments for rent in Westlands Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Nairobi Vacant Houses has fully furnished studio apartments and bedsitters in Westlands ranging from KES 20,000 to over KES 100,000 per month. Use our location filter to browse all Westlands listings.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of houses are available for rent in Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On Nairobi Vacant Houses you can find bedsitters (studio apartments), single rooms, one bedroom apartments, two bedroom apartments, and three bedroom houses and apartments across all Nairobi neighborhoods.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much is a 2 bedroom apartment in Kilimani Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Two bedroom apartments in Kilimani, Nairobi typically range from KES 35,000 to KES 90,000 per month depending on amenities such as gym, swimming pool, parking, and backup generator.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there houses for rent near Kasarani Stadium Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, there are many rental options near Kasarani including bedsitters, single rooms and one bedroom apartments. Prices in Kasarani start from around KES 7,000 for a bedsitter. Browse our Kasarani listings for current availability.',
      },
    },
  ],
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Houses for Rent in Nairobi Kenya',
  description:
    'Browse all vacant houses, bedsitters, single rooms, one bedroom and multi-bedroom apartments for rent across Nairobi.',
  url: 'https://www.nairobivacanthouses.co.ke/listings',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Bedsitters for Rent in Nairobi',
      url: 'https://www.nairobivacanthouses.co.ke/listings?property_type=bedsitter',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Single Rooms for Rent in Nairobi',
      url: 'https://www.nairobivacanthouses.co.ke/listings?property_type=single_room',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'One Bedroom Houses for Rent in Nairobi',
      url: 'https://www.nairobivacanthouses.co.ke/listings?property_type=one_bedroom',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Two Bedroom Apartments for Rent in Nairobi',
      url: 'https://www.nairobivacanthouses.co.ke/listings?property_type=two_bedroom',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Three Bedroom Houses for Rent in Nairobi',
      url: 'https://www.nairobivacanthouses.co.ke/listings?property_type=three_bedroom',
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Houses for Rent in Westlands',
      url: 'https://www.nairobivacanthouses.co.ke/listings?location=Westlands',
    },
    {
      '@type': 'ListItem',
      position: 7,
      name: 'Houses for Rent in Kilimani',
      url: 'https://www.nairobivacanthouses.co.ke/listings?location=Kilimani',
    },
    {
      '@type': 'ListItem',
      position: 8,
      name: 'Houses for Rent in Kasarani',
      url: 'https://www.nairobivacanthouses.co.ke/listings?location=Kasarani',
    },
    {
      '@type': 'ListItem',
      position: 9,
      name: 'Houses for Rent in Pipeline Embakasi',
      url: 'https://www.nairobivacanthouses.co.ke/listings?location=Pipeline',
    },
    {
      '@type': 'ListItem',
      position: 10,
      name: 'Houses for Rent in Karen',
      url: 'https://www.nairobivacanthouses.co.ke/listings?location=Karen',
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────
   ROOT LAYOUT  (pure Server Component – zero event handlers here)
   ───────────────────────────────────────────────────────────────── */
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.nairobivacanthouses.co.ke" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        {/* Geo targeting */}
        <meta name="geo.region" content="KE-30" />
        <meta name="geo.placename" content="Nairobi, Kenya" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />

        {/* Crawl signals */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
        <meta name="coverage" content="Kenya" />
        <meta name="distribution" content="global" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />

        {/* Dublin Core */}
        <meta name="DC.title" content="Nairobi Vacant Houses – Houses for Rent in Nairobi, Kenya" />
        <meta name="DC.subject" content="Real Estate, House Rental, Nairobi, Kenya, Bedsitters, Apartments" />
        <meta name="DC.description" content="Browse and list vacant houses for rent in Nairobi Kenya. Bedsitters, single rooms, one bedroom, two bedroom and three bedroom apartments available." />
        <meta name="DC.publisher" content="Nairobi Vacant Houses" />
        <meta name="DC.language" content="en" />
        <meta name="DC.coverage" content="Nairobi, Kenya" />
        <meta name="DC.rights" content="Copyright 2025 Nairobi Vacant Houses" />
      </head>

      <body>
        <AuthProvider>
          <ToastProvider>
            {/*
              SkipLink is a 'use client' component.
              It owns the onFocus/onBlur handlers – they never touch this
              Server Component, which is what caused the original error.
            */}
            <SkipLink />

            <Navbar />

            <main id="main-content" role="main">
              {children}
            </main>

            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}