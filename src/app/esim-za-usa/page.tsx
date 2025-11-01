import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import CompactPlansSectionWrapper from '@/components/country/CompactPlansSectionWrapper';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import FAQSection from '@/components/country/FAQSection';
import DynamicCTASection from '@/components/common/DynamicCTASection';
import { Metadata } from 'next';
import { getLowestPriceInBGN, getPriceRangeInBGN, generateCountryCheckoutUrl } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema, generateProductSchema, getPriceValidUntilDate } from '@/lib/seo';

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

export default async function USAPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('US');
  
  // Generate Saily checkout URL for USA
  const checkoutUrl = await generateCountryCheckoutUrl('US');
  
  // Breadcrumb Schema for USA page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('САЩ', 'esim-za-usa');
  
  // Product Schema for USA page
  const productSchema = generateProductSchema({
    name: 'eSIM за САЩ – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за САЩ с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/esim-za-usa'),
    countryCode: 'US',
    offers: {
      lowPrice: priceRange.lowPrice.toString(),
      currency: 'BGN',
      availability: 'InStock',
      priceValidUntil: getPriceValidUntilDate(),
      offerCount: priceRange.offerCount.toString()
    },
    brand: {
      name: 'Travel eSIM BG',
      url: 'https://travelesim.bg'
    }
  });
  
  return (
    <>
      {/* Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      
      <main>
      <HeroSectionWrapper
        breadcrumb="eSIM САЩ"
        title="Купи eSIM за САЩ - Мобилен интернет без роуминг"
        subtitle="eSIM е дигитална SIM карта, която не е нужно да я поставяш в телефона. Активираш я с QR код и се свързваш с интернет в САЩ без да сменяш физическата карта."
        features={[
          'Фиксирана цена без изненади',
          'Покритие във всички 50 щата',
          'Две карти работят паралелно'
        ]}
        countryName="САЩ"
        countryCode="US"
      />

      <BenefitsSection
        title="Какво е eSIM и защо е подходящо при пътуване до Америка?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: '<a href="/blog/kakvo-e-esim/">eSIM е дигитална SIM карта</a>, която не е нужно да я поставяш в телефона. Активираш я с QR код и се свързваш с интернет в САЩ без да сменяш физическата карта. Лесно и бързо и значително по-евтино от роуминг.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в САЩ"
        countryName="САЩ"
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
        title="Как да закупите план за САЩ?"
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
        ctaUrl={checkoutUrl}
        ctaText="Купи Сега"
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="САЩ"
        rows={[
          {
            feature: 'Включване',
            esim: 'Незабавно стартиране',
            roaming: 'Автоматично, но скъпо',
            localSim: 'Нужен е магазин'
          },
          {
            feature: 'Разходи',
            esim: 'Предплатени тарифи',
            roaming: 'Обикновено €5–€12/ден или повече',
            localSim: 'Евтино, но може да изисква регистрация'
          },
          {
            feature: 'Мрежова скорост',
            esim: '4G/5G',
            roaming: 'Зависи от оператора',
            localSim: '4G/5G'
          },
          {
            feature: 'Номер за обаждания',
            esim: 'Запазваш своя',
            roaming: 'Запазваш своя',
            localSim: 'Нов американски номер'
          },
          {
            feature: 'Простота',
            esim: 'Напълно дигитално',
            roaming: 'Лесно, но скъпо',
            localSim: 'Нужно лично посещение'
          },
          {
            feature: 'Най-добро за',
            esim: 'Повечето пътешественици',
            roaming: 'Само за спешни случаи',
            localSim: 'Бюджетни пътувания с дълъг престой'
          }
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

      <DynamicCTASection />
      </main>
    </>
  );
}

