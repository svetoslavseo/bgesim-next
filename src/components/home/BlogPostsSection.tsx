import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogPostsSection.module.css';

interface BlogPost {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author?: string;
  featuredImage?: string;
}

interface BlogPostsSectionProps {
  title: string;
  subtitle?: string;
  posts: BlogPost[];
}

export default function BlogPostsSection({ title, subtitle, posts }: BlogPostsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.grid}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.card}>
              {post.featuredImage && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={400}
                    height={250}
                    className={styles.image}
                  />
                </div>
              )}
              <div className={styles.content}>
                <div className={styles.meta}>
                  <time className={styles.date}>{post.date}</time>
                  {post.author && <span className={styles.author}>{post.author}</span>}
                </div>
                <h3 className={styles.postTitle}>
                  <Link href={`/blog/${post.slug}/`} className={styles.postLink}>
                    {post.title}
                  </Link>
                </h3>
                <Link href={`/blog/${post.slug}/`} className={styles.readMore}>
                  ПРОЧЕТИ ПОВЕЧЕ
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

