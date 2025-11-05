import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import CompactPlansSectionWrapper from '@/components/country/CompactPlansSectionWrapper';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import FAQSection from '@/components/country/FAQSection';
import DynamicCTASection from '@/components/common/DynamicCTASection';
import { Metadata } from 'next';
import { getLowestCountryPriceInBGN, getPriceRangeInBGNForCountryPlans, generateCountryCheckoutUrl } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema, generateProductSchema, getPriceValidUntilDate } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const lowestPrice = await getLowestCountryPriceInBGN('MA');
  
  return {
    title: `eSIM за Мароко: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Мароко от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в Мароко с 4G/5G покритие – в Маракеш, Фес, Казабланка и още.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-maroko'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Мароко: Бърз интернет без роуминг от ${lowestPrice}лв | Travel eSIM`,
      description: `Купи eSIM за Мароко от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в Мароко с 4G/5G покритие – в Маракеш, Фес, Казабланка и още.`,
      url: generateCanonicalUrl('/esim-maroko'),
    },
  };
}

export default async function MoroccoPage() {
  // Get price range (country-only) for aggregate offer
  const priceRange = await getPriceRangeInBGNForCountryPlans('MA');
  
  // Generate Saily checkout URL for Morocco
  const checkoutUrl = await generateCountryCheckoutUrl('MA');
  
  // Breadcrumb Schema for Morocco page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Мароко', 'esim-maroko');
  
  // Product Schema for Morocco page
  const productSchema = generateProductSchema({
    name: 'eSIM за Мароко – Бърз мобилен интернет без роуминг',
    description: 'Купи eSIM за Мароко с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори. Моментална активация.',
    url: generateCanonicalUrl('/esim-maroko'),
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
        title="eSIM за Мароко – Надежден мобилен интернет без роуминг"
        subtitle="Пътуваш до Мароко? Вземи eSIM с бърз интернет и се свържи веднага при кацане – без физическа SIM карта и без скъпи роуминг такси."
        features={[
          'Презареждане онлайн по всяко време',
          '4G/5G покритие в Маракеш, Фес и Казабланка',
          'Запазваш своя номер'
        ]}
        countryName="Мароко"
        countryCode="MA"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Мароко?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: '<a href="/blog/kakvo-e-esim/">eSIM е дигитална SIM карта</a>. Тя заменя физическата SIM карта и дава повече свобода при пътуване. На практика, това е микрочип в телефона и всички настройски се правят софтуерно без нуждата да се ходи до физически офис или да се подписва договор.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
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
            title: 'Незабавна активация',
            description: 'Купи, сканирай QR кода и се свържи за минути.'
          },
          {
            title: 'Без роуминг такси',
            description: 'Използвай местни мрежи на по-ниска цена – идеално за туристи.'
          },
          {
            title: 'Бърз 4G/5G интернет',
            description: 'Стабилна връзка в градовете и при пътувания към Сахара.'
          },
          {
            title: 'Запазваш своя номер',
            description: 'Продължи да използваш WhatsApp, iMessage и Viber с твоя номер.'
          }
        ]}
        image="/media/images/Image-1-1.png"
        imageAlt="Morocco travel"
      />

      <HowToBuySection
        title="Как да закупиш план за Мароко?"
        steps={[
          {
            number: '1',
            title: 'Избери своя план',
            description: 'Избери дестинация и план за мобилни данни с eSIM, който ти пасва.',
            image: '/media/images/how-to-images/Step 1 Saily.png'
          },
          {
            number: '2',
            title: 'Инсталирай eSIM',
            description: 'Настройте eSIM на вашето устройство, следвайки инструкциите в приложението.',
            image: '/media/images/how-to-images/Step 2 Saily.png'
          },
          {
            number: '3',
            title: 'Наслаждавайте се на мобилен интернет в Мароко',
            description: 'Планът се активира при пристигане в Мароко или до 30 дни след покупката.',
            image: '/media/images/how-to-images/Step 3 Saily.png'
          }
        ]}
        ctaUrl={checkoutUrl}
        ctaText="Купи Сега"
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="Мароко"
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
            localSim: 'Евтино, възможна е регистрация'
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
            localSim: 'Нов марокански номер'
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
            question: 'Работи ли eSIM в Мароко навсякъде?',
            answer: 'Да, покритието е налично в основните градове (Маракеш, Фес, Казабланка, Танжер) и в повечето туристически райони.'
          },
          {
            question: 'Мога ли да купя eSIM, докато съм в България?',
            answer: 'Да. Купуваш онлайн и получаваш QR код или настройте eSIM на вашето устройство, следвайки инструкциите в приложението.'
          },
          {
            question: 'Как да презаредя данните си?',
            answer: 'Можеш да закупиш нов план или допълнителни данни онлайн през приложението.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}


