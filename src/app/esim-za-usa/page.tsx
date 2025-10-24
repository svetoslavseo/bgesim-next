import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import CompactPlansSectionWrapper from '@/components/country/CompactPlansSectionWrapper';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import DeviceCompatibility from '@/components/country/DeviceCompatibility';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';
import { getLowestPriceInBGN } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const lowestPrice = await getLowestPriceInBGN('US');
  
  return {
    title: `eSIM за Америка: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за САЩ от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Америка с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-za-usa'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Америка: Бърз интернет без роуминг от ${lowestPrice}лв`,
      description: `Купи eSIM за САЩ от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Америка с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-za-usa'),
    },
  };
}

export default function USAPage() {
  // Breadcrumb Schema for USA page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('САЩ', 'esim-za-usa');
  
  return (
    <>
      {/* Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      <main>
      <HeroSectionWrapper
        breadcrumb="eSIM САЩ"
        title="Купи eSIM за САЩ - Мобилен интернет без роуминг"
        subtitle="eSIM е дигитална SIM карта, която не е нужно да я поставяш в телефона. Активираш я с QR код и се свързваш с интернет в САЩ без да сменяш физическата карта."
        features={[
          'Бързо и надеждно',
          'Работи в над 200 държави',
          'Мигновено активиране'
        ]}
        countryName="USA"
        countryCode="US"
      />

      <BenefitsSection
        title="Какво е eSIM и защо е подходящо при пътуване до Америка?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: 'eSIM е дигитална SIM карта, която не е нужно да я поставяш в телефона. Активираш я с QR код и се свързваш с интернет в САЩ без да сменяш физическата карта. Лесно и бързо и значително по-евтино от роуминг.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в САЩ"
        countryName="USA"
        countryCode="US"
      />

      <BenefitsSection
        title="Защо да избереш eSIM за САЩ?"
        benefits={[
          {
            title: '1. Моментална активация',
            description: 'Получаваш eSIM по имейл и го инсталираш за минути. Без ходене до офиси на мобилни оператори.'
          },
          {
            title: '2. Предплатени данни',
            description: 'Плащаш само за данните, които използваш. Данните са предплатени и няма опасност за надвишаване на сметки и изненади в месечната такса.'
          },
          {
            title: '3. Стабилен и бърз интернет',
            description: '4G/LTE покритие във всички щати и градове.'
          },
          {
            title: '4. Запазваш българския си номер',
            description: 'Използваш WhatsApp и други приложения без проблеми.'
          }
        ]}
        image="/media/images/pexels-pixabay-356844-scaled.jpg"
        imageAlt="USA"
      />

      <HowToBuySection
        title="Как работи eSIM за САЩ?"
        steps={[
          {
            number: '1',
            title: 'Купуваш предплатен план',
            description: 'Избираш най-подходящия вариант за престоя ти в Америка.'
          },
          {
            number: '2',
            title: 'Получаваш QR код',
            description: 'Изпращаме го по имейл веднага.'
          },
          {
            number: '3',
            title: 'Сканираш кода',
            description: 'Следваш инструкциите за инсталация и вече имаш интернет навсякъде в САЩ.'
          }
        ]}
        ctaUrl="https://breezesim.com/products/esimg_us_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="Купи Сега"
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="САЩ"
        rows={[
          {
            feature: 'Активация',
            esim: 'Мигновена с QR код',
            roaming: 'Автоматична, но скъпа',
            localSim: 'Изисква магазин'
          },
          {
            feature: 'Цена',
            esim: 'Изгодни предплатени планове',
            roaming: 'Обикновено €5–€12/ден или повече',
            localSim: 'Евтина, но може да изисква регистрация'
          },
          {
            feature: 'Интернет скорост',
            esim: '4G/5G',
            roaming: 'Зависи от оператора',
            localSim: '4G/5G'
          },
          {
            feature: 'Телефонен номер',
            esim: 'Запазваш своя',
            roaming: 'Запазваш своя',
            localSim: 'Нов американски номер'
          },
          {
            feature: 'Удобство',
            esim: 'Изцяло дигитално',
            roaming: 'Лесно, но скъпо',
            localSim: 'Изисква лично посещение'
          },
          {
            feature: 'Подходящо за',
            esim: 'Повечето пътешественици',
            roaming: 'Само за спешни случаи',
            localSim: 'Бюджетни пътувания с дълъг престой'
          }
        ]}
      />

      <DeviceCompatibility
        title="Съвместим ли е телефонът ти с eSIM?"
        description="Повечето съвременни телефони поддържат eSIM. Провери в: Настройки → Мобилни данни → Добавяне на eSIM"
        devices={[
          'iPhone – XR, XS и по-нови',
          'Samsung – Galaxy S20 и по-нови',
          'Google Pixel – Pixel 3 и по-нови',
          'Други – Провери настройките на устройството си'
        ]}
      />

      <FAQSection
        title="Често задавани въпроси"
        faqs={[
          {
            question: 'Мога ли да използвам eSIM на няколко устройства?',
            answer: 'Не, eSIM може да бъде активиран само на един телефон.'
          },
          {
            question: 'Мога ли да правя обаждания и да изпращам SMS с eSIM?',
            answer: 'eSIM осигурява само мобилни данни. Можеш да използваш WhatsApp, Telegram или Skype за обаждания.'
          },
          {
            question: 'Какво да направя, ако изразходвам данните си?',
            answer: 'Можеш да закупиш нов eSIM и да продължиш да сърфираш.'
          }
        ]}
      />

      <CTASection
        title="Купи своята eSIM карта сега и спести пари от роуминг."
        description="Бързо и сигурно свързване, без нуждата да вадите сегашната SIM карта от телефона. Гарантирано ниски цени от 15лв за 5GB."
        ctaUrl="https://breezesim.com/?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="КУПИ СЕГА"
        variant="purple"
      />
      </main>
    </>
  );
}

