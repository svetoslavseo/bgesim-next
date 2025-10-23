import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Card from '@/components/ui/Card';
import featuredImagesMap from '../../../data/processed/blog-featured-images.json';
import styles from './AuthorProfile.module.css';

interface BlogPost {
  slug: string;
  title: string;
  publishedDate: string;
  excerpt: string;
}

interface AuthorProfileProps {
  authorName: string;
  authorTitle: string;
  authorImage: string;
  authorBio: string[];
  linkedinUrl: string;
  latestPosts: BlogPost[];
}

export default function AuthorProfile({
  authorName,
  authorTitle,
  authorImage,
  authorBio,
  linkedinUrl,
  latestPosts
}: AuthorProfileProps) {
  return (
    <>
      {/* Hero Section */}
      <Section padding="lg" background="white">
        <Container>
          <div className={styles.heroGrid}>
            {/* Image */}
            <div className={styles.heroImage}>
              <Image
                src={authorImage}
                alt={authorName}
                width={300}
                height={400}
                priority
              />
            </div>
            
            {/* Content */}
            <div className={styles.heroContent}>
              <h1>{authorName}</h1>
              <h2>{authorTitle}</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                {authorBio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div>
                <Link 
                  href={linkedinUrl}
                  className={styles.linkedinButton}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Visit our LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Latest Posts Section */}
      <Section padding="md" background="gray">
        <Container>
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Последни публикации</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
            Последни статии и новини от {authorName}
          </p>
        </Container>
      </Section>
      
      <Section padding="lg">
        <Container>
          <div className={styles.postsGrid}>
            {latestPosts.map((post) => {
              const featuredImagePath = (featuredImagesMap as Record<string, string>)[post.slug];
              
              return (
                <Card
                  key={post.slug}
                  title={post.title}
                  description={post.excerpt}
                  href={`/blog/${post.slug}/`}
                  image={featuredImagePath}
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
                    <span style={{ marginLeft: '0.5rem' }}>
                      • By {authorName}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
