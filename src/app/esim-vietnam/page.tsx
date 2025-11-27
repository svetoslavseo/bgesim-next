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
  const lowestPrice = await getLowestPriceInBGN('VN');
  
  return {
    title: `eSIM за Виетнам на цени от ${lowestPrice}лв: Мобилен интернет за Ханой, Хо Ши Мин и Дананг`,
    description: `Купи eSIM за Виетнам от ${lowestPrice}лв. Бърз мобилен интернет без роуминг такси по време на обиколки из Ханой, Хо Ши Мин, Дананг и по крайбрежието.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-vietnam'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Виетнам на цени от ${lowestPrice}лв: Мобилен интернет без роуминг | Travel eSIM`,
      description: `eSIM за Виетнам с покритие в големите градове и туристически райони. Идеален за backpackers, цифрови номади и туристи, които искат стабилен интернет.`,
      url: generateCanonicalUrl('/esim-vietnam'),
    },
  };
}

export default async function VietnamPage() {
  // Ценови диапазон за агрегирана оферта
  const priceRange = await getPriceRangeInBGN('VN');
  
  // Saily checkout URL за Виетнам
  const checkoutUrl = await generateCountryCheckoutUrl('VN');
  
  // Breadcrumb Schema за Виетнам
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Виетнам', 'esim-vietnam');
  
  // Product Schema за Виетнам
  const productSchema = generateProductSchema({
    name: 'eSIM за Виетнам – Мобилен интернет за пътуване из страната',
    description: 'Купи eSIM за Виетнам и ползвай стабилен мобилен интернет в Ханой, Хо Ши Мин, Дананг, Хой Ан и по цялото крайбрежие. Без физическа SIM карта, без договори и без скъп роуминг.',
    url: generateCanonicalUrl('/esim-vietnam'),
    countryCode: 'VN',
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
          breadcrumb="eSIM Виетнам"
          title="eSIM за Виетнам – Интернет за всяко пътешествие"
          subtitle="Планираш да обикаляш Виетнам с раница на гръб или по организиран тур? eSIM ти дава бърз интернет за навигация, превод, резервации и споделяне на преживяванията в реално време."
          features={[
            'Интернет в Ханой, Хо Ши Мин и туристическите зони',
            'Работи веднага след кацане',
            'Запазваш своя български номер'
          ]}
          countryName="Виетнам"
          countryCode="VN"
        />

        <BenefitsSection
          title="Как помага eSIM при пътуване във Виетнам?"
          benefits={[
            {
              title: 'Перфектен за backpackers и дигитални номади',
              description: '<a href="/blog/kakvo-e-esim/">eSIM е дигитална SIM карта</a>, която настройваш предварително и използваш веднага след пристигане. Не е нужно да търсиш SIM карта на място, да чакаш опашки или да попълваш документи на местен език.'
            }
          ]}
          image="/media/images/Vietnam.png"
          imageAlt="Гледка от Виетнам – пътуване с мобилен интернет от eSIM"
        />

        <CompactPlansSectionWrapper
          title="Избери от всички налични eSIM планове с покритие във Виетнам"
          countryName="Виетнам"
          countryCode="VN"
        />

        <BenefitsSection
          title="Защо да избереш eSIM вместо местна SIM карта във Виетнам?"
          benefits={[
            {
              title: 'По-малко бюрокрация',
              description: 'Местните оператори често изискват документи и регистрация. С eSIM купуваш онлайн и активираш за минути – без допълнителна хартия и формуляри.'
            },
            {
              title: 'Надеждна връзка за карти и превод',
              description: 'Виетнам е динамична страна – от моторите в Хо Ши Мин до тесните улички на Хой Ан. С eSIM имаш интернет за Google Maps, Grab, преводачи и резервации по всяко време.'
            },
            {
              title: 'Гъвкави планове за кратък или дълъг престой',
              description: 'Избираш план според това дали оставаш за няколко дни, няколко седмици или по-дълго. Няма договори и такси за прекратяване.'
            },
            {
              title: 'Комбинираш с българския си номер',
              description: 'Можеш да запазиш българската си SIM карта за банки и SMS, докато eSIM осигурява евтин мобилен интернет във Виетнам.'
            }
          ]}
          image="/media/images/People_1.png"
          imageAlt="Дигитални номади и пътешественици с лаптоп и телефон, използващи eSIM във Виетнам"
        />

        <HowToBuySection
          title="Как да закупите eSIM план за Виетнам?"
          steps={[
            {
              number: '1',
              title: 'Изберете Виетнам като дестинация',
              description: 'Прегледайте наличните eSIM планове за Виетнам и изберете този, който отговаря на вашия престой и нужди от данни.',
              image: '/media/images/how-to-images/Step 1 Saily.png'
            },
            {
              number: '2',
              title: 'Инсталирайте eSIM на устройството си',
              description: 'Ще получите имейл с QR код и инструкции. Сканирайте кода и добавете eSIM плана в настройките на телефона.',
              image: '/media/images/how-to-images/Step 2 Saily.png'
            },
            {
              number: '3',
              title: 'Активирайте при пристигане във Виетнам',
              description: 'Когато кацнете, активирайте eSIM плана и включете мобилните данни. Вече имате интернет за навигация и комуникация.',
              image: '/media/images/how-to-images/Step 3 Saily.png'
            }
          ]}
          ctaUrl={checkoutUrl}
          ctaText="Купи eSIM за Виетнам"
        />

        <ComparisonTable
          title="eSIM vs Роуминг vs Местна SIM във Виетнам"
          countryName="Виетнам"
          rows={[
            {
              feature: 'Стартиране',
              esim: 'Онлайн, без да чакаш на опашка',
              roaming: 'Автоматично, но с високи цени',
              localSim: 'Нужно е да посетиш магазин и да се регистрираш'
            },
            {
              feature: 'Разходи',
              esim: 'Предплатени пакети с ясна цена',
              roaming: 'Скъп трафик и непредвидими сметки',
              localSim: 'По-ниски местни тарифи, но с повече формалности'
            },
            {
              feature: 'Удобство за туристи',
              esim: 'Перфектен за обиколки и често местене между градове',
              roaming: 'Подходящ само ако почти не ползвате данни',
              localSim: 'Добър вариант при много дълъг престой'
            },
            {
              feature: 'Гъвкавост',
              esim: 'Може да се комбинира с други eSIM планове и региони',
              roaming: 'Обвързан с тарифата на българския оператор',
              localSim: 'Ограничен до Виетнам'
            }
          ]}
        />

        <FAQSection
          title="Често задавани въпроси за eSIM за Виетнам"
          faqs={[
            {
              question: 'Подходящ ли е eSIM за хора, които работят дистанционно от Виетнам?',
              answer: 'Да, ако работата ви не изисква много тежък трафик, eSIM е удобен вариант за имейли, чат и видеосрещи. За по-интензивно използване изберете план с повече GB.'
            },
            {
              question: 'Ще работи ли eSIM, ако пътувам между няколко града?',
              answer: 'Да. Плановете са създадени да работят в различни части на страната, включително популярни градове и курорти.'
            },
            {
              question: 'Мога ли да използвам eSIM за навигация с мотор или скутер?',
              answer: 'Разбира се. eSIM осигурява мобилен интернет, така че можете да използвате Google Maps или други приложения за навигация по време на пътуване.'
            },
            {
              question: 'Какво се случва, ако изчерпя включените данни?',
              answer: 'Когато GB-тата свършат, можете да закупите нов eSIM план и да продължите да използвате интернет във Виетнам.'
            }
          ]}
        />

        <DynamicCTASection />
      </main>
    </>
  );
}


