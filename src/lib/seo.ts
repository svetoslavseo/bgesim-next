/**
 * SEO utilities and metadata generation
 */

import type { Metadata } from 'next';
import type { SEOData, OpenGraphImage } from '@/types/content';

/**
 * Default site configuration
 */
export const SITE_CONFIG = {
  name: 'Travel eSIM BG',
  description: 'eSIM карти за пътуване - Бърз интернет без роуминг',
  url: 'https://travelesim.bg',
  locale: 'bg_BG',
  defaultImage: {
    url: '/media/images/TeSim-Logo-Breeze.png',
    width: 1200,
    height: 630,
    alt: 'Travel eSIM BG - eSIM карти за пътуване',
  },
};

/**
 * Generate Next.js Metadata from SEO data
 */
export function generateMetadata(seoData: SEOData): Metadata {
  const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    
    // Canonical URL - self-canonical if not provided
    alternates: {
      canonical: seoData.canonical || SITE_CONFIG.url,
    },
    
    // Robots directives
    robots: {
      index: seoData.robots.index === 'index',
      follow: seoData.robots.follow === 'follow',
    },
    
    // Open Graph
    openGraph: {
      type: seoData.openGraph.type as any,
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      url: seoData.openGraph.url,
      siteName: seoData.openGraph.siteName,
      locale: seoData.openGraph.locale,
      images: seoData.openGraph.images.map((img: OpenGraphImage) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: seoData.openGraph.title,
      })),
    },
    
    // Twitter Card
    twitter: {
      card: seoData.twitter.card as any,
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      images: seoData.openGraph.images[0]?.url,
    },
  };
  
  return metadata;
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(seoData: SEOData): object | null {
  if (!seoData.schema) {
    return null;
  }
  
  return seoData.schema;
}

/**
 * Generate default metadata for a page without SEO data
 */
export function generateDefaultMetadata(title?: string, description?: string, canonicalUrl?: string): Metadata {
  return {
    title: title || SITE_CONFIG.name,
    description: description || SITE_CONFIG.description,
    alternates: {
      canonical: canonicalUrl || SITE_CONFIG.url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      title: title || SITE_CONFIG.name,
      description: description || SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      images: [
        {
          url: SITE_CONFIG.defaultImage.url,
          width: SITE_CONFIG.defaultImage.width,
          height: SITE_CONFIG.defaultImage.height,
          alt: SITE_CONFIG.defaultImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || SITE_CONFIG.name,
      description: description || SITE_CONFIG.description,
      images: [SITE_CONFIG.defaultImage.url],
    },
  };
}

/**
 * Create breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };
}

/**
 * Create article structured data for blog posts
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  modifiedDate: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'url': article.url,
    'datePublished': article.publishedDate,
    'dateModified': article.modifiedDate,
    'author': {
      '@type': 'Person',
      'name': article.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': SITE_CONFIG.name,
      'url': SITE_CONFIG.url,
    },
    'image': article.image || SITE_CONFIG.defaultImage.url,
  };
}

/**
 * Create organization structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': SITE_CONFIG.name,
    'url': SITE_CONFIG.url,
    'logo': {
      '@type': 'ImageObject',
      'url': `${SITE_CONFIG.url}/media/images/logo.png`,
    },
    'description': SITE_CONFIG.description,
  };
}

/**
 * Sanitize text for meta tags
 */
export function sanitizeMetaText(text: string): string {
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  sanitized = sanitized
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Truncate description to optimal length
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  const sanitized = sanitizeMetaText(text);
  
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  
  // Truncate at word boundary
  const truncated = sanitized.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = SITE_CONFIG.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const finalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${baseUrl}${finalPath}`;
}

/**
 * Generate breadcrumb schema for country pages
 */
export function generateCountryBreadcrumbSchema(countryName: string, countrySlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Начало",
        "item": `${SITE_CONFIG.url}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Държави",
        "item": `${SITE_CONFIG.url}/#countries`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `eSIM ${countryName}`,
        "item": `${SITE_CONFIG.url}/${countrySlug}/`
      }
    ]
  };
}

/**
 * Get a date 90 days from now in YYYY-MM-DD format
 */
export function getPriceValidUntilDate(): string {
  const date = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const dateStr = date.toISOString().substring(0, 10);
  return dateStr;
}

/**
 * Generate product schema for eSIM country pages
 */
export function generateProductSchema(data: {
  name: string;
  description: string;
  url: string;
  countryCode: string;
  image?: string;
  offers: {
    lowPrice: string;
    highPrice: string;
    currency: string;
    availability: string;
    priceValidUntil: string;
    offerCount: string;
  };
  brand: {
    name: string;
    url: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "image": data.image || `${SITE_CONFIG.url}/media/images/travelesim/TraveleSIMBG-logo.png`,
    "brand": {
      "@type": "Brand",
      "name": data.brand.name,
      "url": data.brand.url
    },
    "category": "Mobile Data Plans",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": data.offers.currency,
      "lowPrice": data.offers.lowPrice,
      "highPrice": data.offers.highPrice,
      "priceValidUntil": data.offers.priceValidUntil,
      "availability": `https://schema.org/${data.offers.availability}`,
      "offerCount": data.offers.offerCount
    },
    "gtin": data.countryCode,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Activation",
        "value": "Instant via QR code"
      },
      {
        "@type": "PropertyValue",
        "name": "Network Speed",
        "value": "4G/5G"
      },
      {
        "@type": "PropertyValue",
        "name": "Roaming Fees",
        "value": "No roaming fees"
      }
    ]
  };
}



