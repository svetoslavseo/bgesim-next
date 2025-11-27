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
  const lowestPrice = await getLowestPriceInBGN('CA');
  
  return {
    title: `eSIM за Канада на цени от ${lowestPrice}лв: Мобилен интернет без роуминг`,
    description: `Купи eSIM за Канада от ${lowestPrice}лв. Бърз мобилен интернет без роуминг такси в Торонто, Ванкувър, Монреал и курортите в страната. Моментална активация през телефона.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-canada'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Канада на цени от ${lowestPrice}лв: Мобилен интернет без роуминг | Travel eSIM`,
      description: `eSIM за Канада с покритие в големите градове и природни паркове. Идеално решение за туристи, студенти и бизнес пътувания – без високи роуминг такси.`,
      url: generateCanonicalUrl('/esim-canada'),
    },
  };
}

export default async function CanadaPage() {
  // Ценови диапазон за агрегирана оферта
  const priceRange = await getPriceRangeInBGN('CA');
  
  // Saily checkout URL за Канада
  const checkoutUrl = await generateCountryCheckoutUrl('CA');
  
  // Breadcrumb Schema за Канада
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Канада', 'esim-canada');
  
  // Product Schema за Канада
  const productSchema = generateProductSchema({
    name: 'eSIM за Канада – Интернет в Торонто, Ванкувър и Монреал без роуминг',
    description: 'Купи eSIM за Канада и използвай мобилен интернет в големите градове и природните паркове. Без физическа SIM карта, без договори и с лесна онлайн активация.',
    url: generateCanonicalUrl('/esim-canada'),
    countryCode: 'CA',
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
          breadcrumb="eSIM Канада"
          title="eSIM за Канада – Бърз интернет в градовете и планините"
          subtitle="Откриваш Канада – от Ниагара до Ванкувър и Скалистите планини? С eSIM имаш мобилен интернет навсякъде, без да разчиташ на скъп роуминг."
          features={[
            'Интернет в Торонто, Ванкувър и Монреал',
            'Покритие в основните туристически и ски курорти',
            'Без нужда от посещение в местен магазин'
          ]}
          countryName="Канада"
          countryCode="CA"
        />

        <BenefitsSection
          title="Как работи eSIM за Канада?"
          benefits={[
            {
              title: 'Дигитална SIM карта за пътуване',
              description: '<a href="/blog/kakvo-e-esim/">eSIM е дигитална SIM карта</a>, която добавяш към телефона си чрез QR код. Не сменяш настоящата SIM карта – просто добавяш допълнителен мобилен план за Канада.'
            }
          ]}
          image="/media/images/What-is-an-esim.png"
          imageAlt="Обяснение какво е eSIM за пътувания до Канада"
        />

        <CompactPlansSectionWrapper
          title="Избери от всички налични eSIM планове с покритие в Канада"
          countryName="Канада"
          countryCode="CA"
        />

        <BenefitsSection
          title="Предимства на eSIM при пътуване до Канада"
          benefits={[
            {
              title: 'По-добър контрол върху бюджета',
              description: 'Канадските мобилни планове и роумингът от България могат да бъдат скъпи. С eSIM избираш предплатен пакет с ясна цена и избягваш изненадите във фактурата.'
            },
            {
              title: 'Удобство за дълги разстояния',
              description: 'Канада е огромна страна. С eSIM можеш да разчиташ на мобилен интернет при придвижване между градовете, в планините или по време на road-trip.'
            },
            {
              title: 'Запазваш своя номер в България',
              description: 'Двата плана – българският и канадският eSIM – могат да работят едновременно. Така запазваш достъп до банкови SMS-и и обаждания.'
            },
            {
              title: 'Без търсене на локална SIM карта',
              description: 'Не губиш време в търсене на оператор и оферти на летището. Купуваш eSIM предварително и си онлайн веднага след кацане.'
            }
          ]}
          image="/media/images/Feature-image.png"
          imageAlt="Пътешественик с мобилен интернет и eSIM по време на пътуване в Канада"
        />

        <HowToBuySection
          title="Как да купите eSIM план за Канада?"
          steps={[
            {
              number: '1',
              title: 'Изберете дестинация и пакет',
              description: 'Изберете Канада и сравнете плановете според това колко дни ще пътувате и колко данни са ви нужни.',
              image: '/media/images/how-to-images/Step 1 Saily.png'
            },
            {
              number: '2',
              title: 'Инсталирайте eSIM на телефона си',
              description: 'Получавате имейл с QR код и инструкции. Сканирате кода и добавяте eSIM плана за Канада в настройките на устройството.',
              image: '/media/images/how-to-images/Step 2 Saily.png'
            },
            {
              number: '3',
              title: 'Активирайте при пристигане',
              description: 'Включете eSIM плана и мобилните данни, когато пристигнете в Канада. Планът ще се активира автоматично или до 30 дни след покупката.',
              image: '/media/images/how-to-images/Step 3 Saily.png'
            }
          ]}
          ctaUrl={checkoutUrl}
          ctaText="Купи eSIM за Канада"
        />

        <ComparisonTable
          title="eSIM vs Роуминг vs Местна SIM в Канада"
          countryName="Канада"
          rows={[
            {
              feature: 'Начало на услугата',
              esim: 'Онлайн активация за минути',
              roaming: 'Автоматично, но с високи дневни такси',
              localSim: 'Изисква време и регистрация при местен оператор'
            },
            {
              feature: 'Разходи за данни',
              esim: 'Предплатени пакети с фиксирана цена',
              roaming: 'Обикновено скъпи мегабайти',
              localSim: 'Конкурентни местни тарифи, но само в Канада'
            },
            {
              feature: 'Удобство при пътуване',
              esim: 'Активираш веднъж и ползваш навсякъде в страната',
              roaming: 'Зависи от покритието на партньорски оператори',
              localSim: 'Може да се наложи смяна на план при пътуване'
            },
            {
              feature: 'Подходящо за',
              esim: 'Туристи, дигитални номади и бизнес пътувания',
              roaming: 'Кратки пътувания без активна употреба на данни',
              localSim: 'Много дълъг престой или местни жители'
            }
          ]}
        />

        <FAQSection
          title="Често задавани въпроси за eSIM за Канада"
          faqs={[
            {
              question: 'Подходящ ли е eSIM за кратка почивка в Канада?',
              answer: 'Да. Ако пътувате за 5–15 дни, eSIM е удобен начин да имате мобилен интернет без скъп роуминг и без да подписвате договор с местен оператор.'
            },
            {
              question: 'Работи ли eSIM в различни канадски провинции?',
              answer: 'Да, плановете са проектирани да работят в основните градове и региони. Покритието може да варира в много отдалечени райони, но това важи и за местните оператори.'
            },
            {
              question: 'Ще мога ли да използвам приложения като Google Maps и Uber?',
              answer: 'Разбира се. След като активирате eSIM плана, можете да използвате всички приложения, които разчитат на мобилен интернет – навигация, таксита, социални мрежи и др.'
            },
            {
              question: 'Какво да направя, ако изчерпя данните си по време на престоя?',
              answer: 'Можете да поръчате нов eSIM план със същия процес – така си осигурявате още мобилни данни за оставащите дни.'
            }
          ]}
        />

        <DynamicCTASection />
      </main>
    </>
  );
}


