import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  features: string[];
  planDetails: {
    dataRange: string;
    validityRange: string;
    country: string;
    priceFrom: string;
  };
  ctaUrl: string;
  logo?: string;
  trustpilot?: string;
}

export default function HeroSection({
  breadcrumb,
  title,
  subtitle,
  features,
  planDetails,
  ctaUrl,
  logo,
  trustpilot
}: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Travel eSIM</Link>
            <span> » </span>
            <span>{breadcrumb}</span>
          </nav>

          {/* Title */}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          {/* Features List */}
          <ul className={styles.features}>
            {features.map((feature, index) => (
              <li key={index}>
                <svg className={styles.checkmark} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Card */}
        <div className={styles.pricingCard}>
          {logo && (
            <Image
              src={logo}
              alt="Breeze Logo"
              width={150}
              height={40}
              className={styles.logo}
            />
          )}
          {trustpilot && (
            <Image
              src={trustpilot}
              alt="Trustpilot Reviews"
              width={200}
              height={50}
              className={styles.trustpilot}
            />
          )}
          
          <div className={styles.planInfo}>
            <div className={styles.planItem}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span>{planDetails.dataRange}</span>
            </div>
            <div className={styles.planItem}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{planDetails.validityRange}</span>
            </div>
          </div>

          <div className={styles.country}>{planDetails.country}</div>
          <div className={styles.price}>{planDetails.priceFrom}</div>

          <a
            href={ctaUrl}
            className={styles.ctaButton}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
          >
            Избери план
          </a>
        </div>
      </div>
    </section>
  );
}

