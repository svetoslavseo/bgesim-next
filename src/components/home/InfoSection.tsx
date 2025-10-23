import Link from 'next/link';
import Image from 'next/image';
import styles from './InfoSection.module.css';

interface InfoSectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  image?: string;
  imageAlt?: string;
}

export default function InfoSection({ title, description, ctaText, ctaUrl, image, imageAlt }: InfoSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <Link href={ctaUrl} className={styles.ctaButton}>
            {ctaText}
          </Link>
        </div>
        {image && (
          <div className={styles.imageWrapper}>
            <div className={styles.imageGradient}>
              <Image
                src={image}
                alt={imageAlt || ''}
                width={400}
                height={300}
                className={styles.image}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

