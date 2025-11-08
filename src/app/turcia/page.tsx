import HeroSectionServer from '@/components/country/HeroSectionServer';
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
    const lowestPrice = await getLowestPriceInBGN('TR');
    console.log(`Metadata generation - lowest price for Turkey: ${lowestPrice}лв`);
    
    return {
      title: `eSIM за Турция на цени от ${lowestPrice}лв: Мобилен интернет без роуминг`,
      description: `Купи eSIM за Турция от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Турция с 4G/5G покритие.`,
      alternates: {
        canonical: generateCanonicalUrl('/turcia'),
      },
      openGraph: {
        locale: 'bg_BG',
        type: 'website',
        title: `eSIM за Турция на цени от ${lowestPrice}лв: Мобилен интернет без роуминг | Travel eSIM`,
        description: `Купи eSIM за Турция от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Турция с 4G/5G покритие.`,
        url: generateCanonicalUrl('/turcia'),
      },
    };
  } catch (error) {
    console.error('Error generating metadata for Turkey:', error);
    // Fallback to a reasonable price
    return {
      title: `eSIM за Турция на цени от 9лв: Мобилен интернет без роуминг`,
      description: 'Купи eSIM за Турция от 9лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Турция с 4G/5G покритие.',
      alternates: {
        canonical: generateCanonicalUrl('/turcia'),
      },
      openGraph: {
        locale: 'bg_BG',
        type: 'website',
        title: `eSIM за Турция на цени от 9лв: Мобилен интернет без роуминг | Travel eSIM`,
        description: 'Купи eSIM за Турция от 9лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Турция с 4G/5G покритие.',
        url: generateCanonicalUrl('/turcia'),
      },
    };
  }
}

export default async function TurciaPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('TR');
  
  // Breadcrumb Schema for Turkey page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Турция', 'turcia');
  
  // Product Schema for Turkey page
  const productSchema = generateProductSchema({
    name: 'eSIM за Турция – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Турция с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/turcia'),
    countryCode: 'TR',
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
  
  // FAQ Schema for Turkey page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Мога ли да купя eSIM за Турция, докато съм в България?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да! Купи и активирай преди пътуването си, за да имаш интернет веднага щом пристигнеш."
        }
      },
      {
        "@type": "Question", 
        "name": "Какво става, ако свършат данните ми?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Можеш да презаредиш eSIM-а си онлайн по всяко време – без да сменяш оператор."
        }
      },
      {
        "@type": "Question",
        "name": "Работи ли eSIM-ът в цяла Турция?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Да, eSIM-ът работи навсякъде в Турция с добро мобилно покритие."
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
      <HeroSectionServer
        breadcrumb="eSIM Турция"
        title="eSIM за Турция с мобилен интернет"
        subtitle="Пътувате до Турция? С eSIM картата получавате интернет веднага – без роуминг и сложни настройки!"
        features={[
          'Моментална активация в Турция',
          'Запазваш основната SIM и добавяш данни',
          'Активиране онлайн без документи'
        ]}
        countryName="Турция"
        countryCode="TR"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Турция?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: '<a href="/blog/kakvo-e-esim/">eSIM е модерно решение</a> за мобилна свързаност. Тя заменя стандартната SIM карта с вграден чип в телефона ви. След покупка получавате QR код, който сканирате, за да активирате услугата.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM визуализация"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Турция"
        countryName="Турция"
        countryCode="TR"
      />

      <BenefitsSection
        title="Защо eSIM е по-добра от стандартна SIM карта?"
        benefits={[
          {
            title: 'Изгодни цени',
            description: 'Плащате местни тарифи, които са значително по-ниски от роуминга.'
          },
          {
            title: 'Надеждна връзка',
            description: 'Стабилен интернет дори в по-отдалечени райони.'
          },
          {
            title: 'Лесно управление',
            description: 'Променяйте или подновявайте плановете си онлайн за секунди.'
          },
          {
            title: 'Сигурност',
            description: 'Няма риск да загубите или повредите картата си.'
          }
        ]}
        image="/media/images/Untitled-design-1-1.png"
        imageAlt="Turkey"
      />

      <HowToBuySection
        title="Как да закупите план за Турция?"
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

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="Турция"
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
            localSim: 'Нов турски номер'
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
            question: 'Мога ли да купя eSIM за Турция, докато съм в България?',
            answer: 'Да! Купи и активирай преди пътуването си, за да имаш интернет веднага щом пристигнеш.'
          },
          {
            question: 'Какво става, ако свършат данните ми?',
            answer: 'Можеш да презаредиш eSIM-а си онлайн по всяко време – без да сменяш оператор.'
          },
          {
            question: 'Работи ли eSIM-ът в цяла Турция?',
            answer: 'Да, eSIM-ът работи навсякъде в Турция с добро мобилно покритие.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}

