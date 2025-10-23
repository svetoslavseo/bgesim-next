import styles from './WhyUsSection.module.css';

interface WhyUsSectionProps {
  title: string;
  description: string;
}

export default function WhyUsSection({ title, description }: WhyUsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}

