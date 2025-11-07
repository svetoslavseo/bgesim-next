import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '@/lib/content';
import { generateMetadata as generateSEOMetadata, generateArticleSchema } from '@/lib/seo';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import BlogFeaturedImage from '@/components/common/BlogFeaturedImage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import AuthorBio from '@/components/common/AuthorBio';
import RelatedArticles from '@/components/common/RelatedArticles';
import TableOfContents from '@/components/common/TableOfContents';
import DesktopTableOfContents from '@/components/common/DesktopTableOfContents';
import { formatDate, addRelToExternalLinks } from '@/lib/utils';
import { getLowestPriceInBGN } from '@/lib/sailyApi';
import type { Metadata } from 'next';
import styles from './page.module.css';

/**
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generate metadata for each post
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  // Generate base metadata
  const metadata = generateSEOMetadata(post.seo);
  
  // Get the featured image URL (prioritize featuredImageUrl over SEO data)
  const featuredImageUrl = post.featuredImageUrl || post.seo.openGraph.images[0]?.url;
  
  // Override Open Graph images with featured image if available
  if (featuredImageUrl) {
    // Get image dimensions from existing OG image or use defaults
    const existingImage = post.seo.openGraph.images[0];
    const imageUrl = featuredImageUrl.startsWith('http')
      ? featuredImageUrl
      : `https://travelesim.bg${featuredImageUrl}`;
    
    // Update metadata with featured image
    if (metadata.openGraph) {
      metadata.openGraph.images = [{
        url: imageUrl,
        width: existingImage?.width || 1200,
        height: existingImage?.height || 630,
        alt: post.title,
      }];
    }
    
    // Also update Twitter card image
    if (metadata.twitter) {
      metadata.twitter.images = imageUrl;
    }
  }
  
  return metadata;
}

/**
 * Inject CTA HTML before a specific heading in the content
 */
function injectCTABeforeHeading(
  content: string,
  headingText: string,
  ctaHtml: string
): string {
  // Try to find the heading with various possible formats
  // The heading format is: <h2 class="wp-block-heading">3. Как работи роумингът в Сърбия</h2>
  // Also handle ez-toc format with spans: <span class="ez-toc-section"...></span><h2...>...</h2>
  
  const headingPatterns = [
    // Match exact heading with ez-toc span before it
    new RegExp(`(<span[^>]*class="ez-toc-section"[^>]*>.*?</span>\\s*)?<h2[^>]*>.*?3\\.\\s*Как работи роумингът в Сърбия.*?</h2>`, 'i'),
    // Match heading with the exact text
    new RegExp(`<h2[^>]*>.*?3\\.\\s*Как работи роумингът в Сърбия.*?</h2>`, 'i'),
    // Match with escaped special characters
    new RegExp(`<h2[^>]*>.*?${headingText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?</h2>`, 'i'),
  ];

  for (const pattern of headingPatterns) {
    const match = content.match(pattern);
    if (match) {
      const headingMatch = match[0];
      const headingIndex = content.indexOf(headingMatch);
      
      if (headingIndex !== -1) {
        // Insert CTA HTML before the heading (including any ez-toc span)
        return (
          content.slice(0, headingIndex) +
          ctaHtml +
          content.slice(headingIndex)
        );
      }
    }
  }

  // Fallback: try to find by partial text match
  const partialMatchPattern = new RegExp('(<h2[^>]*>.*?Как работи роумингът.*?</h2>)', 'i');
  const partialMatch = content.match(partialMatchPattern);
  if (partialMatch) {
    const headingMatch = partialMatch[0];
    const headingIndex = content.indexOf(headingMatch);
    
    if (headingIndex !== -1) {
      return (
        content.slice(0, headingIndex) +
        ctaHtml +
        content.slice(headingIndex)
      );
    }
  }

  // If not found, return original content
  return content;
}

/**
 * Generate CTA HTML for Serbia eSIM
 */
async function generateSerbiaCTAHTML(): Promise<string> {
  try {
    const lowestPrice = await getLowestPriceInBGN('RS');
    
    return `
      <div style="margin: 3rem 0; padding: 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, #ad6ca5 50%, #c8a2d0 100%); background-color: #ad6ca5; border-radius: 12px; position: relative; overflow: hidden;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 2rem; position: relative; z-index: 1; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <h3 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 0.75rem 0; color: #000000; line-height: 1.3; display: flex; align-items: center; gap: 0.75rem;">
              <img 
                src="/media/flags/rs.svg" 
                alt="Сърбия флаг" 
                width="48" 
                height="48" 
                style="display: block; width: 48px; height: 48px; flex-shrink: 0; object-fit: contain;"
                loading="eager"
                decoding="async"
              />
              <span>Купи eSIM за Сърбия от ${lowestPrice}лв</span>
            </h3>
            <p style="font-size: 1rem; margin: 0; color: #000000; line-height: 1.6;">
              Ако пътувате за Сърбия или само преминавате през страната, можете да имате мобилен интернет без да вадите сегашната си SIM карта от телефона.
            </p>
          </div>
          <a 
            href="/esim-serbia" 
            style="display: inline-block; padding: 1.125rem 2.75rem; background: #000000; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 1rem; white-space: nowrap; transition: all 0.3s ease; text-align: center;"
            onmouseover="this.style.background='#1a1a1a'; this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 24px rgba(0, 0, 0, 0.3)';"
            onmouseout="this.style.background='#000000'; this.style.transform='translateY(0)'; this.style.boxShadow='none';"
          >
            Избери План
          </a>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error generating Serbia CTA:', error);
    // Fallback CTA without dynamic price
    return `
      <div style="margin: 3rem 0; padding: 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, #ad6ca5 50%, #c8a2d0 100%); background-color: #ad6ca5; border-radius: 12px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <h3 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 0.75rem 0; color: #000000; display: flex; align-items: center; gap: 0.75rem;">
              <img 
                src="/media/flags/rs.svg" 
                alt="Сърбия флаг" 
                width="48" 
                height="48" 
                style="display: block; width: 48px; height: 48px; flex-shrink: 0; object-fit: contain;"
                loading="eager"
                decoding="async"
              />
              <span>Купи eSIM за Сърбия</span>
            </h3>
            <p style="font-size: 1rem; margin: 0; color: #000000;">
              Ако пътувате за Сърбия или само преминавате през страната, можете да имате мобилен интернет без да вадите сегашната си SIM карта от телефона.
            </p>
          </div>
          <a 
            href="/esim-serbia" 
            style="display: inline-block; padding: 1.125rem 2.75rem; background: #000000; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 1rem; white-space: nowrap;"
          >
            Избери План
          </a>
        </div>
      </div>
    `;
  }
}

/**
 * Blog post page component
 */
export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Get featured image URL (absolute)
  const featuredImageUrl = post.featuredImageUrl
    ? (post.featuredImageUrl.startsWith('http')
        ? post.featuredImageUrl
        : `https://travelesim.bg${post.featuredImageUrl}`)
    : post.seo.openGraph.images[0]?.url;
  
  // Generate article schema with featured image
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.seo.description,
    url: post.url,
    publishedDate: post.publishedDate,
    modifiedDate: post.modifiedDate,
    author: post.author,
    image: featuredImageUrl,
  });
  
  // Get featured image for display
  const featuredImagePath = post.featuredImageUrl;
  const featuredImage = post.seo.openGraph.images[0];
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Начало', href: '/' },
    { label: 'Блог', href: '/blog/' },
    { label: post.title },
  ];
  
  // Process content - inject CTA for Serbia article
  let processedContent = addRelToExternalLinks(post.content);
  if (params.slug === 'rouming-v-syrbia-ceni-paketi-esim-alternativi') {
    const ctaHtml = await generateSerbiaCTAHTML();
    processedContent = injectCTABeforeHeading(
      processedContent,
      '3. Как работи роумингът в Сърбия',
      ctaHtml
    );
  }
  
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      
      {/* Desktop Table of Contents - Fixed Sidebar */}
      <DesktopTableOfContents content={post.content} />
      
      {/* Article content */}
      <Section padding="lg" className={styles.noTopPadding}>
        <Container size="xl">
          <article className={styles.article}>
            {/* 1. Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />
            
            {/* 2. H1 Headline */}
            <header>
              <h1 className={styles.headline}>
                {post.title}
              </h1>
            </header>
            
            
            {/* 3. Published/Updated dates */}
            <div className={styles.meta}>
              {post.publishedDate !== post.modifiedDate ? (
                <time dateTime={post.modifiedDate}>
                  Актуализирано: {formatDate(post.modifiedDate)}
                </time>
              ) : (
                <time dateTime={post.publishedDate}>
                  Публикувано: {formatDate(post.publishedDate)}
                </time>
              )}
              
              {post.categories.length > 0 && (
                <span className={styles.categoryLabel}>
                  {post.categories.join(', ')}
                </span>
              )}
            </div>
            
            {/* 4. Author name */}
            {post.author && (
              <div className={styles.authorLine}>
                <span className={styles.authorLabel}>Автор:</span>
                <Link href="/v-andreev/" className={styles.authorName}>
                  {post.author}
                </Link>
                <span className={styles.authorTitle}> (Автор и основател)</span>
              </div>
            )}
            
            {/* 5. Lead image (Featured Image) */}
            {featuredImagePath && featuredImage && (
              <div className={styles.imageWrapper}>
                <BlogFeaturedImage
                  src={featuredImagePath}
                  alt={post.title}
                  width={featuredImage.width}
                  height={featuredImage.height}
                />
              </div>
            )}
            
            {/* Excerpt (optional intro) - REMOVED */}
            {/* {post.excerpt && (
              <div 
                className={styles.excerpt}
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )} */}
            
            {/* Table of Contents - Removed in favor of desktop sidebar */}
            
            {/* 6. Main content */}
            <div 
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className={styles.tags}>
                <h3 className={styles.tagsTitle}>
                  Тагове:
                </h3>
                <div className={styles.tagsList}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 7. Author bio section */}
            {post.author && (
              <AuthorBio
                name={post.author}
                avatar="/media/images/vasil-andreev-150x150.jpeg"
                url="/v-andreev/"
              />
            )}
          </article>
        </Container>
      </Section>
      
      {/* Related Articles Section */}
      <RelatedArticles excludeSlug={params.slug} />
    </>
  );
}



