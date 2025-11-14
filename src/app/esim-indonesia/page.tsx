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
  try {
    const lowestPrice = await getLowestPriceInBGN('ID');
    console.log(`Metadata generation - lowest price for Indonesia: ${lowestPrice}лв`);
    
    return {
      title: `eSIM за Индонезия (вкл. Бали) на цени от ${lowestPrice}лв: Мобилен интернет без роуминг`,
      description: `Купи eSIM за Индонезия и Бали от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Индонезия с 4G/5G покритие.`,
      alternates: {
        canonical: generateCanonicalUrl('/esim-indonesia'),
      },
      openGraph: {
        locale: 'bg_BG',
        type: 'website',
        title: `eSIM за Индонезия (вкл. Бали) на цени от ${lowestPrice}лв: Мобилен интернет без роуминг | Travel eSIM`,
        description: `Купи eSIM за Индонезия и Бали от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Индонезия с 4G/5G покритие.`,
        url: generateCanonicalUrl('/esim-indonesia'),
      },
    };
  } catch (error) {
    console.error('Error generating metadata for Indonesia:', error);
    // Fallback to a reasonable price
    return {
      title: `eSIM за Индонезия (вкл. Бали) на цени от 9лв: Мобилен интернет без роуминг`,
      description: 'Купи eSIM за Индонезия и Бали от 9лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Индонезия с 4G/5G покритие.',
      alternates: {
        canonical: generateCanonicalUrl('/esim-indonesia'),
      },
      openGraph: {
        locale: 'bg_BG',
        type: 'website',
        title: `eSIM за Индонезия (вкл. Бали) на цени от 9лв: Мобилен интернет без роуминг | Travel eSIM`,
        description: 'Купи eSIM за Индонезия и Бали от 9лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Индонезия с 4G/5G покритие.',
        url: generateCanonicalUrl('/esim-indonesia'),
      },
    };
  }
}

export default async function IndonesiaPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('ID');
  
  // Generate Saily checkout URL for Indonesia
  const checkoutUrl = await generateCountryCheckoutUrl('ID');
  
  // Breadcrumb Schema for Indonesia page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Индонезия', 'esim-indonesia');
  
  // Product Schema for Indonesia page
  const productSchema = generateProductSchema({
    name: 'eSIM за Индонезия и Бали – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Индонезия с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация. Работи в цяла Индонезия, включително Бали.',
    url: generateCanonicalUrl('/esim-indonesia'),
    countryCode: 'ID',
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
  
  // FAQ Schema for Indonesia page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Мога ли да купя eSIM за Индонезия, докато съм в България?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да! Купи и активирай преди пътуването си, за да имаш интернет веднага щом пристигнеш в Индонезия или Бали."
        }
      },
      {
        "@type": "Question", 
        "name": "Работи ли eSIM-ът в Бали?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, eSIM-ът работи в цяла Индонезия, включително Бали, с добро мобилно покритие."
        }
      },
      {
        "@type": "Question",
        "name": "Какво става, ако свършат данните ми?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Можеш да презаредиш eSIM-а си онлайн по всяко време – без да сменяш оператор."
        }
      }
    ]
  };

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
      
      {/* Structured Data - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      
      <main>
      <HeroSectionWrapper
        breadcrumb="eSIM Индонезия"
        title="eSIM за Индонезия и Бали – Надежден и бърз мобилен интернет"
        subtitle="Ще пътуваш до Индонезия или Бали? Купи eSIM с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори."
        features={[
          'Покритие в цяла Индонезия, включително Бали',
          '4G покритие в градове и плажове',
          'Два номера едновременно в телефона'
        ]}
        countryName="Индонезия"
        countryCode="ID"
      />

      <BenefitsSection
        title="Остани свързан в Индонезия и Бали с eSIM"
        benefits={[
          {
            title: 'Без физическа SIM карта',
            description: 'Ще пътуваш до Индонезия или Бали? Купи eSIM с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Активирай веднага и се наслади на безпроблемен интернет още при кацане на островите.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM визуализация"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Индонезия и Бали"
        countryName="Индонезия"
        countryCode="ID"
      />

      <BenefitsSection
        title="Защо да избереш eSIM за Индонезия и Бали?"
        benefits={[
          {
            title: 'Незабавна активация',
            description: 'Без чакане. Купи, сканирай и се свържи веднага след кацане.'
          },
          {
            title: 'Без роуминг такси',
            description: 'Използвай местна мрежа на по-ниска цена от роуминга.'
          },
          {
            title: 'Бърз 4G/5G интернет',
            description: 'Наслади се на гладко сърфиране, обаждания и стрийминг в Джакарта, Бали и другите острови.'
          },
          {
            title: 'Запази своя номер',
            description: 'Ползвай WhatsApp, iMessage и обаждания както обикновено, докато си в Индонезия.'
          },
          {
            title: 'Покритие навсякъде',
            description: 'Работи в цяла Индонезия – от плажовете на Бали до градовете на Ява и Суматра.'
          }
        ]}
        image="/media/images/Untitled-design-3.png"
        imageAlt="Индонезия и Бали"
      />

      <HowToBuySection
        title="Как да закупите план за Индонезия?"
        steps={[
          {
            number: '1',
            title: 'Изберете вашия план',
            description: 'Изберете вашата дестинация (Индонезия/Бали) и изберете вашия план за данни за пътуване с eSIM.',
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
            description: 'Вашият план ще се активира, когато стигнете до Индонезия или 30 дни след покупката.',
            image: '/media/images/how-to-images/Step 3 Saily.png'
          }
        ]}
        ctaUrl={checkoutUrl}
        ctaText="Купи Сега"
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре за Индонезия?"
        countryName="Индонезия"
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
            localSim: 'Нов индонезийски номер'
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
            question: 'Мога ли да купя eSIM за Индонезия, докато съм в България?',
            answer: 'Да! Купи онлайн и активирай преди пътуването си, за да имаш интернет веднага щом пристигнеш в Индонезия или Бали.'
          },
          {
            question: 'Работи ли eSIM-ът в Бали?',
            answer: 'Да, eSIM-ът работи в цяла Индонезия, включително Бали, с добро мобилно покритие в градовете и туристическите зони.'
          },
          {
            question: 'Как да презаредя моя eSIM докато съм в Индонезия?',
            answer: 'Можеш да купиш допълнителни данни по всяко време на нашия уебсайт, без да сменяш оператор.'
          },
          {
            question: 'Какво се случва, ако изчерпам данните си?',
            answer: 'Можеш да закупиш допълнителни данни през своя акаунт онлайн, без да посещаваш магазин.'
          },
          {
            question: 'Работи ли eSIM-ът в цяла Индонезия?',
            answer: 'Да, eSIM-ът работи навсякъде в Индонезия, включително всички острови като Бали, Ява, Суматра и други.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}

