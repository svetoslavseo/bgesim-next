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
  const lowestPrice = await getLowestPriceInBGN('EG');
  
  return {
    title: `eSIM за Египет: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Египет от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Египет с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-egipet'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Египет: Бърз интернет без роуминг от ${lowestPrice}лв | Travel eSIM`,
      description: `Купи eSIM за Египет от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Египет с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-egipet'),
    },
  };
}

export default async function EgyptPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('EG');
  
  // Generate Saily checkout URL for Egypt
  const checkoutUrl = await generateCountryCheckoutUrl('EG');
  
  // Breadcrumb Schema for Egypt page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Египет', 'esim-egipet');
  
  // Product Schema for Egypt page
  const productSchema = generateProductSchema({
    name: 'eSIM за Египет – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Египет с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/esim-egipet'),
    countryCode: 'EG',
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
        breadcrumb="eSIM Египет"
        title="eSIM за Египет – Мобилен интернет без роуминг"
        subtitle="Пътувате до Египет? Получете бърз и надежден интернет с eSIM. Без физическа SIM карта, без високи такси за роуминг."
        features={[
          'Активация от вкъщи',
          'Стабилен интернет в пустини',
          'Запазваш WhatsApp номера'
        ]}
        countryName="Египет"
        countryCode="EG"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Египет?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: '<a href="/blog/kakvo-e-esim/">eSIM е модерна алтернатива</a> на физическата SIM карта. Работи чрез вграден чип в телефона ви. След покупка получавате QR код, който сканирате за активация. В Египет ви дава достъп до местни мобилни мрежи за бърз и надежден интернет без високи такси за роуминг.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Египет"
        countryName="Египет"
        countryCode="EG"
      />

      <BenefitsSection
        title="Защо да изберете eSIM за Египет?"
        benefits={[
          {
            title: 'Без скъп роуминг',
            description: 'Избегнете високите такси за роуминг и ползвайте местни мрежи на по-ниски цени.'
          },
          {
            title: 'Бърз 4G/5G интернет',
            description: 'Свържете се към най-добрите мрежи в Египет и използвайте интернет без прекъсвания.'
          },
          {
            title: 'Лесна активация',
            description: 'Получавате QR код по имейл, сканирате го и eSIM е готов за използване за минути.'
          },
          {
            title: 'Запазвате номера си',
            description: 'Продължавате да използвате WhatsApp, Viber и други приложения с вашия обичаен номер.'
          }
        ]}
        image="/media/images/Egypt.png"
        imageAlt="Egypt"
      />

      <HowToBuySection
        title="Как да закупите план за Египет?"
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
        countryName="Египет"
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
            localSim: 'Евтино, но може да изисква регистрация'
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
            localSim: 'Нов египетски номер'
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
            question: 'Съвместим ли е моят телефон с eSIM?',
            answer: 'Повечето нови модели iPhone (XR и по-нови), Samsung (S20 и по-нови) и Google Pixel (3 и по-нови) поддържат eSIM. Проверете в настройките на телефона си.'
          },
          {
            question: 'Мога ли да използвам eSIM за обаждания?',
            answer: 'eSIM предоставя само мобилни данни. За обаждания можете да използвате приложения като WhatsApp, Viber или Skype.'
          },
          {
            question: 'Какво става, ако изчерпам данните си?',
            answer: 'Можете да закупите нов eSIM план по всяко време и да продължите да използвате интернет.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}

