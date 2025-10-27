import Link from 'next/link';
import { getRecentPosts } from '@/lib/content';
import { formatDate, extractExcerpt } from '@/lib/utils';
import featuredImagesMap from '../../../data/processed/blog-featured-images.json';
import styles from './RelatedArticles.module.css';

interface RelatedArticlesProps {
  excludeSlug?: string; // Slug of current post to exclude from related articles
}

export default function RelatedArticles({ excludeSlug }: RelatedArticlesProps) {
  // Get recent posts, but exclude the current one
  const allRecentPosts = getRecentPosts(10);
  const relatedPosts = allRecentPosts
    .filter(post => post.slug !== excludeSlug)
    .slice(0, 3);
  
  // Don't render if we don't have any related posts
  if (relatedPosts.length === 0) {
    return null;
  }
  
  return (
    <section className={styles.section} id="related-articles">
      <div className={styles.container}>
        <h2 className={styles.heading}>Други Статии</h2>
        <p className={styles.subheading}>
          Прочети още интересни материали от нашия блог
        </p>
        
        <div className={styles.grid}>
          {relatedPosts.map((post) => {
            const featuredImagePath = (featuredImagesMap as Record<string, string>)[post.slug];
            
            return (
              <article key={post.slug} className={styles.card}>
                <Link href={`/blog/${post.slug}/`} className={styles.link}>
                  {featuredImagePath && (
                    <div className={styles.imageWrapper}>
                      <img 
                        src={featuredImagePath} 
                        alt={post.title}
                        className={styles.image}
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className={styles.content}>
                    <time 
                      dateTime={post.publishedDate}
                      className={styles.date}
                    >
                      {formatDate(post.publishedDate)}
                    </time>
                    
                    <h3 className={styles.title}>
                      {post.title}
                    </h3>
                    
                    <p className={styles.excerpt}>
                      {extractExcerpt(post.excerpt || post.content, 120)}
                    </p>
                    
                    <div className={styles.readMore}>
                      Прочети Повече
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.arrow}
                      >
                        <path 
                          d="M6 12L10 8L6 4" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

