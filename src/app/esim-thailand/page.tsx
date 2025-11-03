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
  const lowestPrice = await getLowestPriceInBGN('TH');
  
  return {
    title: `eSIM за Тайланд: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Тайланд от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Тайланд с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-thailand'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Тайланд: Бърз интернет без роуминг от ${lowestPrice}лв | Travel eSIM`,
      description: `Купи eSIM за Тайланд от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Тайланд с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-thailand'),
    },
  };
}

export default async function ThailandPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('TH');
  
  // Generate Saily checkout URL for Thailand
  const checkoutUrl = await generateCountryCheckoutUrl('TH');
  
  // Breadcrumb Schema for Thailand page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Тайланд', 'esim-thailand');
  
  // Product Schema for Thailand page
  const productSchema = generateProductSchema({
    name: 'eSIM за Тайланд – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Тайланд с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/esim-thailand'),
    countryCode: 'TH',
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
        breadcrumb="eSIM Тайланд"
        title="eSIM за Тайланд – Надежден и бърз мобилен интернет"
        subtitle="Ще пътуваш до Тайланд? Купи eSIM с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори."
        features={[
          'Презареждане отвсякъде без магазин',
          '4G покритие в плажове и планини',
          'Два номера едновременно в телефона'
        ]}
        countryName="Тайланд"
        countryCode="TH"
      />

      <BenefitsSection
        title="Остани свързан в Тайланд с eSIM"
        benefits={[
          {
            title: 'Без физическа SIM карта',
            description: 'Ще пътуваш до Тайланд? Купи eSIM с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Активирай веднага и се наслади на безпроблемен интернет още при кацане.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Тайланд"
        countryName="Тайланд"
        countryCode="TH"
      />

      <BenefitsSection
        title="Защо да избереш eSIM за Тайланд?"
        benefits={[
          {
            title: 'Незабавна активация',
            description: 'Без чакане. Купи, сканирай и се свържи.'
          },
          {
            title: 'Без роуминг такси',
            description: 'Използвай местна мрежа на по-ниска цена.'
          },
          {
            title: 'Бърз 4G/5G интернет',
            description: 'Наслади се на гладко сърфиране, обаждания и стрийминг.'
          },
          {
            title: 'Запази своя номер',
            description: 'Ползвай WhatsApp, iMessage и обаждания както обикновено.'
          },
          {
            title: 'Без физическа SIM карта',
            description: 'Превключвай планове без да сменяш карти.'
          }
        ]}
        image="/media/images/PhuketThailand.png"
        imageAlt="Phuket, Thailand"
      />

      <HowToBuySection
        title="Как да закупите план за Тайланд?"
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
        countryName="Тайланд"
        rows={[
          {
            feature: 'Започване',
            esim: 'Моментално включване',
            roaming: 'Автоматично, но скъпо',
            localSim: 'Нужен е магазин'
          },
          {
            feature: 'Ценообразуване',
            esim: 'Предплатени планове',
            roaming: 'Обикновено €5–€12/ден или повече',
            localSim: 'Евтино, но може да изисква регистрация'
          },
          {
            feature: 'Бързина на интернет',
            esim: '4G/5G',
            roaming: 'Зависи от оператора',
            localSim: '4G/5G'
          },
          {
            feature: 'Телефонен номер',
            esim: 'Запазваш своя',
            roaming: 'Запазваш своя',
            localSim: 'Нов тайландски номер'
          },
          {
            feature: 'Лекота на използване',
            esim: 'Напълно дигитално',
            roaming: 'Лесно, но скъпо',
            localSim: 'Нужно лично посещение'
          },
          {
            feature: 'Подходящо за',
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
            question: 'Мога ли да купя eSIM, докато съм в България?',
            answer: 'Да. Купи онлайн и активирай преди пътуването си.'
          },
          {
            question: 'Как да презаредя моя eSIM докато съм в Тайланд?',
            answer: 'Можеш да купиш допълнителни данни по всяко време на нашия уебсайт.'
          },
          {
            question: 'Какво се случва, ако изчерпам данните си?',
            answer: 'Можеш да закупиш допълнителни данни през своя акаунт.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}

