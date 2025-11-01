import { getRecentPosts, getPageBySlug } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const blogPage = getPageBySlug('blog');
  
  if (blogPage) {
    return generateSEOMetadata(blogPage.seo);
  }
  
  // Fallback metadata if blog page data is not available
  return {
    title: 'Блог',
    description: 'Статии и новини за eSIM технологиите и мобилната свързаност',
    alternates: {
      canonical: 'https://travelesim.bg/blog/',
    },
  };
}

export default function BlogPage() {
  const posts = getRecentPosts(100); // Get all posts
  
  if (posts.length === 0) {
    return (
      <Section padding="lg">
        <Container>
          <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Блог</h1>
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            Няма публикувани статии. Стартирайте извличането на данни за да заредите съдържанието.
          </p>
        </Container>
      </Section>
    );
  }
  
  return (
    <>
      <Section padding="md" background="gray">
        <Container>
          <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Блог</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 0 }}>
            Последни статии и новини
          </p>
        </Container>
      </Section>
      
      <Section padding="lg">
        <div className={styles.blogContainer}>
          <div className={styles.postsGrid}>
            {posts.map((post) => (
                <Card
                  key={post.slug}
                  title={post.title}
                  href={`/blog/${post.slug}/`}
                  image={post.featuredImageUrl}
                  imageAlt={post.title}
                >
                <div style={{ 
                  marginTop: '1rem', 
                  fontSize: '0.875rem', 
                  color: '#6b7280' 
                }}>
                  <time dateTime={post.publishedDate}>
                    {formatDate(post.publishedDate)}
                  </time>
                  {post.categories.length > 0 && (
                    <span style={{ marginLeft: '0.5rem' }}>
                      • {post.categories[0]}
                    </span>
                  )}
                </div>
              </Card>
              ))}
          </div>
        </div>
      </Section>
    </>
  );
}



