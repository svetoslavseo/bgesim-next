import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Колко мобилни данни (мобилен интернет) са ми нужни, когато пътувам?
        </h1>
        <p className={styles.subtitle}>
          Този калкулатор ще Ви помогне да изчислите, колко мобилни данни изразходвате на дневна, седмична и месечна база. На база данните от калкулатора ще може да избере по-добре вашия eSIM план.
        </p>
      </div>
    </section>
  );
}

