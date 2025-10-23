import Link from 'next/link';
import styles from './BottomCTASection.module.css';

interface BottomCTASectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  features: string[];
}

export default function BottomCTASection({ title, description, ctaText, ctaUrl, features }: BottomCTASectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <Link href={ctaUrl} className={styles.ctaButton} target="_blank" rel="noopener noreferrer">
            {ctaText}
          </Link>
          <div className={styles.features}>
            {features.map((feature, index) => (
              <div key={index} className={styles.feature}>
                <span className={styles.icon}>✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

