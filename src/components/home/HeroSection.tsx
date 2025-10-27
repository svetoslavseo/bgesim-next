import CountrySearch from '@/components/common/CountrySearch';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className={`${styles.hero} hero-section`}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <CountrySearch />
      </div>
    </section>
  );
}

