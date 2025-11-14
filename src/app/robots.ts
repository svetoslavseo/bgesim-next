import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        // Disallow Next.js internal CSS module paths that may have version query parameters
        // These paths like /_next/static/css/app/*.css?v=* return 404s and shouldn't be crawled
        '/_next/static/css/app/',
        // Disallow any URLs with ?v= query parameter (cache-busting parameters)
        '/*?v=',
      ],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}



