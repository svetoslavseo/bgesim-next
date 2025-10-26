import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getPageBySlug } from '@/lib/content';
import ESIMCompatibilityChecker from '@/components/esim-checker/ESIMCompatibilityChecker';
import styles from './page.module.css';

/**
 * Generate metadata for eSIM compatibility checker page
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('proverka-na-syvmestimost-s-esim');
  
  if (!page) {
    return {
      title: 'Безплатна Проверка на Съвместимост с eSIM - Travel eSIM',
      description: 'Проверка на съвместимост с eSIM - Travel eSIM BG',
    };
  }
  
  return generateSEOMetadata(page.seo);
}

/**
 * eSIM Compatibility Checker page component
 */
export default function ESIMCompatibilityPage() {
  // Structured Data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Как да разбера дали моето устройство поддържа eSIM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Нашият инструмент съдържа актуализиран списък със съвместими устройства с eSIM."
        }
      },
      {
        "@type": "Question",
        "name": "Как да активирам eSIM на моето устройство?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Активирането обикновено включва сканиране на QR код от вашия оператор или въвеждане на данни в настройките на вашето устройство."
        }
      },
      {
        "@type": "Question",
        "name": "Какви са предимствата на eSIM пред физическата SIM карта?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "eSIM предоставя удобство при смяна на оператори, възможност за съхраняване на множество профили и премахва нуждата от физическа карта, както и цената на мобилен интернет в чужбина е доста по-достъпна."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Начало",
        "item": "https://travelesim.bg/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Проверка на съвместимост с eSIM",
        "item": "https://travelesim.bg/proverka-na-syvmestimost-s-esim/"
      }
    ]
  };

  return (
    <main>
      {/* Structured Data - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section with Checker Tool */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.mainTitle}>
            Безплатна проверка на съвместимост с eSIM
          </h1>
          
          <ESIMCompatibilityChecker />
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>
                Сместете пари от роумин с технологията eSIM
              </h2>
              <p className={styles.bodyText}>
                С технологията eSIM можете да се насладите на безпроблемен мобилен интернет без нуждата от физически SIM карти. Чудите се дали вашето устройство поддържа eSIM? Просто въведете модела на вашия смартфон и нашият БЕЗПЛАТЕН eSIM инструмент ще ви даде незабавен отговор. eSIM плановете с фиксирани данни предлагат несравнима гъвкавост при пътуване, но единственото условие е, вашият телефон да позволява ползването на тази технология.
              </p>
            </div>
            <div className={styles.imageContent}>
              <Image
                src="/media/images/3-3.png"
                alt="Сместете пари от роумин с технологията eSIM"
                width={500}
                height={500}
                className={styles.image}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is eSIM Section */}
      <section className={styles.section} style={{ background: '#F9FAFB' }}>
        <div className={styles.container}>
          <div className={styles.contentGrid} style={{ flexDirection: 'row-reverse' }}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>
                Како е eSIM?
              </h2>
              <p className={styles.bodyText}>
                eSIM, или вграден модул за идентификация на абонат (Embedded Subscriber Identity Module), е вид SIM карта, която е директно вградена в устройство като смартфон, таблет или смарт часовник, вместо да бъде сменяема физическа карта, както традиционните SIM карти.
              </p>
              <p className={styles.bodyText}>
                Технологията eSIM е създадена, за да улесни потребителите при смяната на мобилни мрежи. eSIM позволява лесно да превключвате между мобилни оператори без нужда от физическа смяна на SIM карта.
              </p>
              <p className={styles.bodyText}>
                Независимо дали сте почитател на Android или iOS, удобството на eSIM технологията ви дава пълен контрол върху избора на мрежа – бързо, лесно и без усилие.
              </p>
              <p className={styles.bodyText}>
                <Link href="/kakvo-e-esim" className={styles.link}>
                  Прочети повече за технологията и за това какво точно представлява eSIM
                </Link>
              </p>
            </div>
            <div className={styles.imageContent}>
              <Image
                src="/media/images/What-is-an-esim.png"
                alt="какво е e-sim"
                width={500}
                height={335}
                className={styles.image}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 
            className={styles.sectionTitle} 
            style={{ textAlign: 'center', marginBottom: '48px' }}
            tabIndex={0}
            role="button"
            aria-label="Често Задавани Въпроси - натиснете за да изберете"
          >
            Често Задавани Въпроси
          </h2>
          
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Как да разбера дали моето устройство поддържа eSIM?
              </h3>
              <p className={styles.faqAnswer}>
                Нашият инструмент съдържа актуализиран списък със съвместими устройства с eSIM.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Как да активирам eSIM на моето устройство?
              </h3>
              <p className={styles.faqAnswer}>
                Активирането обикновено включва сканиране на QR код от вашия оператор или въвеждане на данни в настройките на вашето устройство.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Какви са предимствата на eSIM пред физическата SIM карта?
              </h3>
              <p className={styles.faqAnswer}>
                eSIM предоставя удобство при смяна на оператори, възможност за съхраняване на множество профили и премахва нуждата от физическа карта, както и цената на мобилен интернет в чужбина е доста по-достъпна.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h3 className={styles.ctaTitle}>
                Купи своята eSIM карта сега и спести пари от роуминг.
              </h3>
              <p className={styles.ctaText}>
                Бързо и сигурно свързване, без нуждата да вадите сегашната SIM карта от телефона. Гарантирано ниски цени от 15лв за 5GB.
              </p>
              <a
                href="https://breezesim.com?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                КУПИ СЕГА
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.trustBadges}>
            <div className={styles.badge}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <p>Бързо и надеждно</p>
            </div>
            <div className={styles.badge}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <p>Работи в над 100 държави</p>
            </div>
            <div className={styles.badge}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
              </svg>
              <p>Мигновено активиране</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

