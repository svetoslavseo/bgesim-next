import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import CompactPlansSectionWrapper from '@/components/country/CompactPlansSectionWrapper';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import FAQSection from '@/components/country/FAQSection';
import DynamicCTASection from '@/components/common/DynamicCTASection';
import { Metadata } from 'next';
import { getLowestPriceInBGN, getPriceRangeInBGN } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema, generateProductSchema, getPriceValidUntilDate } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const lowestPrice = await getLowestPriceInBGN('MA');
  
  return {
    title: `eSIM за Мароко: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Мароко от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в Мароко с 4G/5G покритие – Казабланка, Маракеш, Рабат, Фес и др.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-morocco'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Мароко: Бърз интернет без роуминг от ${lowestPrice}лв | Travel eSIM`,
      description: `Купи eSIM за Мароко от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в Мароко с 4G/5G покритие – Казабланка, Маракеш, Рабат, Фес и др.`,
      url: generateCanonicalUrl('/esim-morocco'),
    },
  };
}

export default async function MoroccoPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('MA');
  
  // Breadcrumb Schema for Morocco page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Мароко', 'esim-morocco');
  
  // Product Schema for Morocco page
  const productSchema = generateProductSchema({
    name: 'eSIM за Мароко – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Мароко с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/esim-morocco'),
    countryCode: 'MA',
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
        breadcrumb="eSIM Мароко"
        title="eSIM за Мароко с мобилен интернет"
        subtitle="Пътувате до Мароко? С eSIM получавате интернет веднага – без роуминг и без търсене на магазини. Работи в Казабланка, Маракеш, Рабат, Фес, Агадир и туристическите райони."
        features={[
          'Моментална активация в Мароко',
          'Запазваш основната SIM и добавяш данни',
          'Активиране онлайн без документи'
        ]}
        countryName="Мароко"
        countryCode="MA"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Мароко?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: 'eSIM заменя физическата SIM с вграден цифров профил в телефона. Купуваш онлайн, получаваш QR код и активираш за минути – без посещения в магазин. В Мароко това означава бърз достъп до местни мрежи с 4G/5G покритие в големите градове и туристически зони.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM визуализация"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Мароко"
        countryName="Мароко"
        countryCode="MA"
      />

      <BenefitsSection
        title="Защо да избереш eSIM за Мароко?"
        benefits={[
          {
            title: 'Без роуминг такси',
            description: 'Плащаш локални тарифи и избягваш непредвидими разходи за роуминг.'
          },
          {
            title: 'Стабилно покритие',
            description: 'От Казабланка и Маракеш до Рабат, Фес и бреговата линия – получаваш надежден интернет за навигация, чат и карти.'
          },
          {
            title: 'Лесно управление',
            description: 'Променяй или подновявай плана онлайн. Няма договори и скрити такси.'
          },
          {
            title: 'Сигурност',
            description: 'Няма риск да загубиш или повредиш физическа карта. Всичко е дигитално.'
          }
        ]}
        image="/media/images/Untitled-design-1-1.png"
        imageAlt="Morocco"
      />

      <HowToBuySection
        title="Как да закупите план за Мароко?"
        steps={[
          {
            number: '1',
            title: 'Изберете вашия план',
            description: 'Изберете дестинация Мароко и предпочитан обем данни за вашето пътуване.',
            image: '/media/images/how-to-images/Step 1 Saily.png'
          },
          {
            number: '2',
            title: 'Инсталирайте eSIM',
            description: 'Сканирайте QR кода и завършете настройките в телефона си – за минути.',
            image: '/media/images/how-to-images/Step 2 Saily.png'
          },
          {
            number: '3',
            title: 'Свързаност навсякъде',
            description: 'Планът се активира автоматично при пристигане в Мароко или до 30 дни след покупката.',
            image: '/media/images/how-to-images/Step 3 Saily.png'
          }
        ]}
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Кое е най-удобно?"
        countryName="Мароко"
        rows={[
          {
            feature: 'Стартиране',
            esim: 'Моментално включване',
            roaming: 'Автоматично, но скъпо',
            localSim: 'Нужен е магазин'
          },
          {
            feature: 'Стойност',
            esim: 'Предплатени пакети',
            roaming: 'Обикновено €5–€12/ден или повече',
            localSim: 'Евтино, но често изисква регистрация'
          },
          {
            feature: 'Скорост на мрежата',
            esim: '4G/5G',
            roaming: 'Зависи от оператора',
            localSim: '4G/5G'
          },
          {
            feature: 'Мобилен номер',
            esim: 'Запазваш своя',
            roaming: 'Запазваш своя',
            localSim: 'Нов марокански номер'
          },
          {
            feature: 'Практичност',
            esim: 'Напълно дигитално',
            roaming: 'Лесно, но скъпо',
            localSim: 'Нужно лично посещение'
          },
          {
            feature: 'Идеално за',
            esim: 'Повечето туристи',
            roaming: 'Само за спешни случаи',
            localSim: 'Бюджетни пътувания с дълъг престой'
          }
        ]}
      />

      <FAQSection
        title="Често задавани въпроси"
        faqs={[
          {
            question: 'Мога ли да купя eSIM за Мароко, докато съм в България?',
            answer: 'Да. Купувате онлайн и активирате преди тръгване. При пристигане в Мароко интернетът е готов.'
          },
          {
            question: 'Какво ако изчерпя данните си?',
            answer: 'Можете да презаредите плана онлайн за секунди – без да сменяте оператор.'
          },
          {
            question: 'Работи ли eSIM-ът в цяла страна?',
            answer: 'Да, има покритие в основните градове и туристически райони: Казабланка, Маракеш, Рабат, Фес, Агадир и др.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}


