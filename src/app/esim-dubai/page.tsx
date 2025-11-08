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
  const lowestPrice = await getLowestPriceInBGN('AE');
  
  return {
    title: `eSIM за Дубай на цени от ${lowestPrice}лв: Мобилен интернет без роуминг`,
    description: `Купи eSIM за Дубай от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Дубай с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-dubai'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Дубай на цени от ${lowestPrice}лв: Мобилен интернет без роуминг | Travel eSIM`,
      description: `Купи eSIM за Дубай от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Дубай с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-dubai'),
    },
  };
}

export default async function DubaiPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('AE');
  
  // Generate Saily checkout URL for Dubai
  const checkoutUrl = await generateCountryCheckoutUrl('AE');
  
  // Breadcrumb Schema for Dubai page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Дубай', 'esim-dubai');
  
  // Product Schema for Dubai page
  const productSchema = generateProductSchema({
    name: 'eSIM за Дубай – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Дубай с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/esim-dubai'),
    countryCode: 'AE',
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
        breadcrumb="eSIM Дубай"
        title="eSIM за Дубай"
        subtitle="С eSIM получаваш интернет веднага – без нужда от физическа SIM карта или посещение в магазин. Получаваш QR код по имейл, сканираш го и се свързваш за минути."
        features={[
          'Интернет още в летището при кацане',
          'Избягвай скъпия роуминг в Дубай',
          'Без физическа карта всичко в телефона'
        ]}
        countryName="Дубай"
        countryCode="AE"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Дубай?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: '<a href="/blog/kakvo-e-esim/">eSIM е дигитална SIM карта</a>. Не ти трябва пластика или чип. След като направиш поръчка, получаваш QR код по имейл. Сканираш го с телефона си и активираш интернет плана за няколко минути. В Дубай това е практичен избор – не губиш време в търсене на магазини или попълване на документи. Всичко става онлайн и бързо.'
          }
        ]}
        image="/media/images/People-1.png"
        imageAlt="eSIM People"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Дубай"
        countryName="Дубай"
        countryCode="AE"
      />

      <BenefitsSection
        title="Предимства на eSIM в Дубай"
        benefits={[
          {
            title: '1. Без роуминг такси',
            description: 'Плащаш фиксирана цена и знаеш точно какво получаваш. Без изненадващи сметки.'
          },
          {
            title: '2. Бърз и стабилен интернет',
            description: 'Свързваш се към местни мобилни мрежи с добро покритие – 4G или 5G в Дубай Марина, Дубай Мол, Палм Джумейра и други популярни места.'
          },
          {
            title: '3. Активиране без усилие',
            description: 'Получаваш QR код по имейл. Сканираш го и следваш няколко стъпки в настройките. Няма нужда от техническа помощ.'
          },
          {
            title: '4. Съвместимост с модерни телефони',
            description: 'Ако имаш iPhone XS или по-нов, Samsung Galaxy S20 или Google Pixel от последните години – eSIM ще работи.'
          }
        ]}
        image="/media/images/Untitled_design_2-1.png"
        imageAlt="Dubai"
      />

      <HowToBuySection
        title="Как да закупите план за Дубай?"
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
        countryName="Дубай"
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
            localSim: 'Нов местен номер'
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
            question: 'Моят телефон съвместим ли е с eSIM?',
            answer: 'Ако устройството ти е пуснато след 2018 г. (напр. iPhone XS, Galaxy S20, Pixel 4), eSIM трябва да работи. Виж пълния списък на сайта.'
          },
          {
            question: 'Мога ли да извършвам обаждания?',
            answer: 'Плановете включват само мобилен интернет. За разговори можеш да използваш WhatsApp, Viber и други приложения.'
          },
          {
            question: 'Мога ли да закупя нов план, ако изчерпам данните си?',
            answer: 'Да, можеш да закупиш нов пакет по всяко време със същата процедура.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}

