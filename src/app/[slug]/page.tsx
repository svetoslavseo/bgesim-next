import { notFound } from 'next/navigation';
import { getAllPageSlugs, getPageBySlug } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { addRelToExternalLinks } from '@/lib/utils';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import type { Metadata } from 'next';

/**
 * Generate static params for all pages
 */
export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  
  // Filter out 'home' as it's handled by the root page
  // Also exclude static files that shouldn't be handled by this route
  // Exclude country pages that have their own dedicated routes
  // Exclude calculator page that has its own dedicated route
  // Exclude 'blog' as it has its own route at /blog/
  const staticFiles = ['favicon.ico', 'sw.js', 'robots.txt', 'sitemap.xml'];
  const countryPages = ['turcia', 'esim-dubai', 'esim-egipet', 'esim-serbia', 'esim-thailand', 'esim-velikobritania', 'esim-za-usa'];
  const dedicatedRoutes = ['calculator-za-izpolzvani-mobilni-danni', 'proverka-na-syvmestimost-s-esim', 'contacts', 'v-andreev'];
  
  return slugs
    .filter(slug => 
      slug !== 'home' && 
      slug !== '' && 
      slug !== 'blog' &&
      !staticFiles.includes(slug) &&
      !countryPages.includes(slug) &&
      !dedicatedRoutes.includes(slug)
    )
    .map((slug) => ({
      slug,
    }));
}

/**
 * Generate metadata for each page
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const page = getPageBySlug(params.slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }
  
  return generateSEOMetadata(page.seo);
}

/**
 * Page component
 */
export default function Page({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const page = getPageBySlug(params.slug);
  
  if (!page) {
    notFound();
  }
  
  return (
    <>
      <Section padding="md">
        <Container>
          {/* Structured data if available */}
          {page.seo.schema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(page.seo.schema),
              }}
            />
          )}
          
          {/* Page title */}
          <h1 style={{ marginBottom: '2rem' }}>{page.title}</h1>
          
          {/* Page content */}
          <div 
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: addRelToExternalLinks(page.content) }}
          />
        </Container>
      </Section>
    </>
  );
}



