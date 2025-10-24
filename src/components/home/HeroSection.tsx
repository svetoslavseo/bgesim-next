import Link from 'next/link';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}

export default function HeroSection({ title, subtitle, ctaText, ctaUrl }: HeroSectionProps) {
  return (
    <section className={`${styles.hero} hero-section`}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <Link 
          href={ctaUrl} 
          className={styles.ctaButton} 
          target="_blank" 
          rel="noopener noreferrer nofollow sponsored"
          prefetch={false}
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}

