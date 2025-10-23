import styles from './CTASection.module.css';
import Image from 'next/image';

interface CTASectionProps {
  title: string;
  description: string;
  ctaUrl: string;
  ctaText: string;
  variant?: 'purple' | 'black';
}

export default function CTASection({
  title,
  description,
  ctaUrl,
  ctaText,
  variant = 'purple'
}: CTASectionProps) {
  return (
    <section className={`${styles.cta} ${styles[variant]}`}>
      <div className={styles.container}>
        <div className={styles.checkmark}>
          <Image
            src="/media/images/1.png"
            alt="Checkmark"
            width={96}
            height={96}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <a
          href={ctaUrl}
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}

