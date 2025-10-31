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
  const lowestPrice = await getLowestPriceInBGN('RS');
  
  return {
    title: `eSIM за Сърбия: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Сърбия от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Сърбия с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-serbia'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Сърбия: Бърз интернет без роуминг от ${lowestPrice}лв`,
      description: `Купи eSIM за Сърбия от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Сърбия с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-serbia'),
    },
  };
}

export default async function SerbiaPage() {
  // Get price range for aggregate offer
  const priceRange = await getPriceRangeInBGN('RS');
  
  // Breadcrumb Schema for Serbia page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Сърбия', 'esim-serbia');
  
  // Product Schema for Serbia page
  const productSchema = generateProductSchema({
    name: 'eSIM за Сърбия – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Сърбия с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/esim-serbia'),
    countryCode: 'RS',
    offers: {
      lowPrice: priceRange.lowPrice.toString(),
      highPrice: priceRange.highPrice.toString(),
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
        breadcrumb="eSIM Сърбия"
        title="eSIM Сърбия"
        subtitle="Забрави за високите такси за роуминг. С eSIM картата получавате интернет веднага – без роуминг и сложни настройки!"
        features={[
          'Директно свързване към сръбски мрежи',
          'Активация преди границата',
          'Без риск от загуба на карта'
        ]}
        countryName="Сърбия"
        countryCode="RS"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Сърбия?"
        benefits={[
          {
            title: 'Модерно решение за мобилна свързаност',
            description: 'eSIM е модерно решение за мобилна свързаност. Тя заменя стандартната SIM карта с вграден чип в телефона ви. След покупка получавате QR код, който сканирате, за да активирате услугата. В Сърбия това ви осигурява достъп до местни мрежи за бърз, надежден и изгоден интернет, където и да сте.'
          }
        ]}
        image="/media/images/People_1.png"
        imageAlt="eSIM People"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Сърбия"
        countryName="Сърбия"
        countryCode="RS"
      />

      <BenefitsSection
        title="Защо да избереш eSIM за Сърбия?"
        benefits={[
          {
            title: 'Без роуминг такси',
            description: 'Таксите за роуминг в Сърбия могат да бъдат изненадващо високи – особено ако идваш от ЕС, Обединеното кралство или извън Европа.'
          },
          {
            title: 'Запазваш номера си',
            description: 'Можеш да използваш датския (или другия си основен) номер за WhatsApp, iMessage и обаждания, докато eSIM се грижи за мобилните ти данни.'
          },
          {
            title: 'Мигновена активация',
            description: 'Купуваш онлайн, получаваш QR код и активираш за минути – без посещения в магазини и без документи.'
          },
          {
            title: 'Бърз 4G/5G интернет',
            description: 'Наслаждавай се на стабилна връзка в цяла Сърбия – както в големите градове, така и в по-отдалечени райони.'
          }
        ]}
        image="/media/images/Untitled_design_3.png"
        imageAlt="Serbia"
      />

      <HowToBuySection
        title="Как да закупите план за Сърбия?"
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
        countryName="Сърбия"
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
            localSim: 'Нов сръбски номер'
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
            question: 'Мога ли да купя eSIM за Сърбия, докато съм в България?',
            answer: 'Да! Купи и активирай преди пътуването си, за да имаш интернет веднага щом пристигнеш.'
          },
          {
            question: 'Какво става, ако свършат данните ми?',
            answer: 'Можеш да презаредиш eSIM-а си онлайн по всяко време – без да сменяш оператор.'
          },
          {
            question: 'Работи ли eSIM-ът и в други страни?',
            answer: 'Някои планове покриват и други балкански държави. Провери дали са включени Черна гора, Босна или Хърватия.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}

