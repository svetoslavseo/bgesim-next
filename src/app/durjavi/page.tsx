import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { generateCanonicalUrl } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'eSIM за всички държави - Travel eSIM by Breeze',
  description: 'Намерете eSIM планове за всички популярни дестинации. Бърз интернет без роуминг такси в над 100 държави по света.',
  alternates: {
    canonical: generateCanonicalUrl('/durjavi'),
  },
  openGraph: {
    locale: 'bg_BG',
    type: 'website',
    title: 'eSIM за всички държави - Travel eSIM by Breeze',
    description: 'Намерете eSIM планове за всички популярни дестинации. Бърз интернет без роуминг такси в над 100 държави по света.',
    url: generateCanonicalUrl('/durjavi'),
  },
};

const countries = [
  {
    name: 'Турция',
    href: '/turcia/',
    flag: '/media/images/4.png',
    description: 'eSIM за Турция с мобилен интернет',
    price: 'от 9лв'
  },
  {
    name: 'Великобритания',
    href: '/esim-velikobritania/',
    flag: '/media/images/5.png',
    description: 'eSIM за Великобритания с мобилен интернет',
    price: 'от 12лв'
  },
  {
    name: 'САЩ',
    href: '/esim-za-usa/',
    flag: '/media/images/Flags_-1.png',
    description: 'eSIM за САЩ с мобилен интернет',
    price: 'от 15лв'
  },
  {
    name: 'Тайланд',
    href: '/esim-thailand/',
    flag: '/media/images/2-1.png',
    description: 'eSIM за Тайланд с мобилен интернет',
    price: 'от 8лв'
  },
  {
    name: 'Дубай',
    href: '/esim-dubai/',
    flag: '/media/images/6.png',
    description: 'eSIM за Дубай с мобилен интернет',
    price: 'от 10лв'
  },
  {
    name: 'Сърбия',
    href: '/esim-serbia/',
    flag: '/media/images/Flags_-2.png',
    description: 'eSIM за Сърбия с мобилен интернет',
    price: 'от 7лв'
  },
  {
    name: 'Египет',
    href: '/esim-egipet/',
    flag: '/media/flags/eg.png',
    description: 'eSIM за Египет с мобилен интернет',
    price: 'от 9лв'
  }
];

export default function DurjaviPage() {
  return (
    <>
      {/* Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Начало",
                "item": generateCanonicalUrl('/')
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Държави",
                "item": generateCanonicalUrl('/durjavi')
              }
            ]
          }),
        }}
      />
      
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>eSIM за всички държави</h1>
            <p className={styles.subtitle}>
              Намерете идеалния eSIM план за вашето пътуване. Бърз интернет без роуминг такси в над 100 държави по света.
            </p>
          </div>
        </section>

        {/* Countries Grid */}
        <section className={styles.countriesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Популярни дестинации</h2>
            <div className={styles.grid}>
              {countries.map((country) => (
                <Link
                  key={country.href}
                  href={country.href}
                  className={styles.countryCard}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.flagContainer}>
                      <Image
                        src={country.flag}
                        alt={`${country.name} flag`}
                        width={48}
                        height={48}
                        className={styles.flag}
                        loading="lazy"
                        quality={85}
                        sizes="48px"
                      />
                    </div>
                    <div className={styles.countryInfo}>
                      <h3 className={styles.countryName}>{country.name}</h3>
                      <p className={styles.countryDescription}>{country.description}</p>
                      <span className={styles.price}>{country.price}</span>
                    </div>
                  </div>
                  <div className={styles.cardArrow}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Защо да изберете eSIM?</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M16 2L20.09 8.26L28 9.27L22 14.14L23.18 22.02L16 18.77L8.82 22.02L10 14.14L4 9.27L11.91 8.26L16 2Z"
                      fill="#4CAF50"
                    />
                  </svg>
                </div>
                <h3 className={styles.benefitTitle}>Моментална активация</h3>
                <p className={styles.benefitDescription}>
                  Сканирайте QR кода и активирайте eSIM-а си за секунди, без да чакате физическа карта.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 26C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z"
                      fill="#4CAF50"
                    />
                    <path
                      d="M16 8c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"
                      fill="#4CAF50"
                    />
                    <path
                      d="M16 12c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"
                      fill="#4CAF50"
                    />
                  </svg>
                </div>
                <h3 className={styles.benefitTitle}>Изгодни цени</h3>
                <p className={styles.benefitDescription}>
                  Спестете до 90% от роуминг таксите с местни тарифи в избраната дестинация.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M16 2L20.09 8.26L28 9.27L22 14.14L23.18 22.02L16 18.77L8.82 22.02L10 14.14L4 9.27L11.91 8.26L16 2Z"
                      fill="#4CAF50"
                    />
                  </svg>
                </div>
                <h3 className={styles.benefitTitle}>Надеждна връзка</h3>
                <p className={styles.benefitDescription}>
                  Стабилен 4G/5G интернет в над 100 държави с най-добрите местни мрежи.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Готови да започнете?</h2>
              <p className={styles.ctaDescription}>
                Изберете вашата дестинация и купете eSIM план за секунди. Без роуминг такси, без напрежение.
              </p>
              <a
                href="https://breezesim.com?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
                className={styles.ctaButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Виж Всички Оферти
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
