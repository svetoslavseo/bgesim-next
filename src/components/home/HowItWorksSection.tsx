import Image from 'next/image';
import styles from './HowItWorksSection.module.css';

interface Step {
  number: string;
  title: string;
  description: string;
  image?: string;
}

interface HowItWorksSectionProps {
  title: string;
  subtitle?: string;
  steps: Step[];
  image?: string;
  imageAlt?: string;
}

export default function HowItWorksSection({ title, subtitle, steps }: HowItWorksSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.grid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.card}>
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
      </div>
    </section>
  );
}

