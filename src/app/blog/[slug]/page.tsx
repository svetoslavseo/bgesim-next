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
  
  return generateSEOMetadata(post.seo);
}

/**
 * Blog post page component
 */
export default function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Generate article schema
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.seo.description,
    url: post.url,
    publishedDate: post.publishedDate,
    modifiedDate: post.modifiedDate,
    author: post.author,
    image: post.seo.openGraph.images[0]?.url,
  });
  
  // Get featured image
  const featuredImagePath = post.featuredImageUrl;
  const featuredImage = post.seo.openGraph.images[0];
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Начало', href: '/' },
    { label: 'Блог', href: '/blog/' },
    { label: post.title },
  ];
  
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
              dangerouslySetInnerHTML={{ __html: addRelToExternalLinks(post.content) }}
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



