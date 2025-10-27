import Image from 'next/image';
import styles from './HowToBuySection.module.css';

interface Step {
  number: string;
  title: string;
  description: string;
  image?: string;
}

interface HowToBuySectionProps {
  title: string;
  steps: Step[];
  ctaUrl?: string;
  ctaText?: string;
}

export default function HowToBuySection({ title, steps, ctaUrl, ctaText }: HowToBuySectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.stepNumber}>{step.number}</div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                {step.image && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={400}
                      height={300}
                      className={styles.stepImage}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {ctaUrl && ctaText && (
          <div className={styles.ctaWrapper}>
            <a
              href={ctaUrl}
              className={styles.ctaButton}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

