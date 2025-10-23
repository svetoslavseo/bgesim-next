import Link from 'next/link';
import Image from 'next/image';
import styles from './BenefitsSection.module.css';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  title: string;
  benefits: Benefit[];
  ctaText?: string;
  ctaUrl?: string;
}

export default function BenefitsSection({ title, benefits, ctaText, ctaUrl }: BenefitsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.card}>
              <Image
                src={benefit.icon}
                alt=""
                width={150}
                height={150}
                className={styles.icon}
              />
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
        {ctaText && ctaUrl && (
          <div className={styles.ctaWrapper}>
            <Link href={ctaUrl} className={styles.ctaButton} target="_blank" rel="noopener noreferrer">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

