import Image from 'next/image';
import styles from './HowItWorksSection.module.css';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  title: string;
  steps: Step[];
  image?: string;
  imageAlt?: string;
}

export default function HowItWorksSection({ title, steps, image, imageAlt }: HowItWorksSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.grid}>
          {image && (
            <div className={styles.imageWrapper}>
              <Image
                src={image}
                alt={imageAlt || 'How it works'}
                width={500}
                height={400}
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.steps}>
            {steps.map((step) => (
              <div key={step.number} className={styles.step}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

