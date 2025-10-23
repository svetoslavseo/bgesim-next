import styles from './HowToBuySection.module.css';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowToBuySectionProps {
  title: string;
  steps: Step[];
  ctaUrl?: string;
  ctaText?: string;
}

export default function HowToBuySection({ title, steps, ctaUrl, ctaText }: HowToBuySectionProps) {
  return (
    <section className={styles.howToBuy}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
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

