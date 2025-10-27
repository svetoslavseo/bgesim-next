import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { generateCanonicalUrl } from '@/lib/seo';
import DynamicCTASection from '@/components/common/DynamicCTASection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
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
        <section className={styles.countriesSection} id="Дестинации">
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

        {/* How It Works Section */}
        <HowItWorksSection
          title="Как работи?"
          subtitle="Нямате приложението за eSIM още? Изтеглете го от App Store или Google Play."
          steps={[
            {
              number: '1',
              title: 'Изберете вашия план',
              description: 'Изберете вашата дестинация и изберете вашия план за данни за пътуване с eSIM.',
              image: '/media/images/how-to-images/Step 1 Saily.png'
            },
            {
              number: '2',
              title: 'Изтеглете и настройте вашия eSIM',
              description: 'Настройте eSIM на вашето устройство, следвайки инструкциите в приложението.',
              image: '/media/images/how-to-images/Step 2 Saily.png'
            },
            {
              number: '3',
              title: 'Наслаждавайте се на свързаността!',
              description: 'Вашият план ще се активира, когато стигнете до дестинацията си или 30 дни след покупката.',
              image: '/media/images/how-to-images/Step 3 Saily.png'
            }
          ]}
        />

        {/* CTA Section */}
        <DynamicCTASection />
      </main>
    </>
  );
}
