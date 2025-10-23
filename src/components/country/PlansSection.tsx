import styles from './PlansSection.module.css';

interface Plan {
  name: string;
  data: string;
  validity: string;
  price: string;
  ctaUrl: string;
}

interface PlansSectionProps {
  title: string;
  lastUpdated?: string;
  plans: Plan[];
}

export default function PlansSection({ title, lastUpdated, plans }: PlansSectionProps) {
  return (
    <section className={styles.plans}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {lastUpdated && (
          <p className={styles.lastUpdated}>Последно обновяване: {lastUpdated}</p>
        )}
        
        <div className={styles.plansGrid}>
          {plans.map((plan, index) => (
            <div key={index} className={styles.planCard}>
              <div className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z"/>
                </svg>
              </div>
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planDetails}>
                {plan.data && <span>{plan.data}</span>}
                {plan.validity && <span> / {plan.validity}</span>}
              </p>
              <div className={styles.price}>{plan.price}</div>
              <a
                href={plan.ctaUrl}
                className={styles.button}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                Избери
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

