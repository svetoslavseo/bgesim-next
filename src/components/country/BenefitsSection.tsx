import Image from 'next/image';
import styles from './BenefitsSection.module.css';

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  title: string;
  benefits: Benefit[];
  image?: string;
  imageAlt?: string;
}

export default function BenefitsSection({ title, benefits, image, imageAlt }: BenefitsSectionProps) {
  return (
    <section className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          
          <div className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <div className={styles.benefitHeader}>
                  <svg className={styles.checkmark} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                </div>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {image && (
          <div className={styles.imageWrapper}>
            <div className={styles.gradientBg}></div>
            <Image
              src={image}
              alt={imageAlt || 'eSIM'}
              width={500}
              height={500}
              className={styles.image}
            />
          </div>
        )}
      </div>
    </section>
  );
}

