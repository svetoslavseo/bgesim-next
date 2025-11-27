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
  const lowestPrice = await getLowestPriceInBGN('IL');
  
  return {
    title: `eSIM за Израел на цени от ${lowestPrice}лв: Мобилен интернет без роуминг`,
    description: `Купи eSIM за Израел от ${lowestPrice}лв. Бърз мобилен интернет без роуминг такси в Тел Авив, Йерусалим и по цялото крайбрежие. Моментална активация с QR код и 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-israel'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Израел на цени от ${lowestPrice}лв: Мобилен интернет без роуминг | Travel eSIM`,
      description: `eSIM за Израел с бърз интернет без роуминг такси. Подходящ за почивки, поклоннически и бизнес пътувания – активираш за минути и ползваш навсякъде в страната.`,
      url: generateCanonicalUrl('/esim-israel'),
    },
  };
}

export default async function IsraelPage() {
  // Ценови диапазон за агрегирана оферта
  const priceRange = await getPriceRangeInBGN('IL');
  
  // Saily checkout URL за Израел
  const checkoutUrl = await generateCountryCheckoutUrl('IL');
  
  // Breadcrumb Schema за Израел
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Израел', 'esim-israel');
  
  // Product Schema за Израел
  const productSchema = generateProductSchema({
    name: 'eSIM за Израел – Мобилен интернет в Тел Авив и Йерусалим без роуминг',
    description: 'Купи eSIM за Израел и остани онлайн в Тел Авив, Йерусалим, Мъртво море и по цялото Средиземноморско крайбрежие. Без физическа SIM карта, без договори, активация за минути.',
    url: generateCanonicalUrl('/esim-israel'),
    countryCode: 'IL',
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
          breadcrumb="eSIM Израел"
          title="eSIM за Израел – Интернет още при кацане на летище Бен Гурион"
          subtitle="Пътуваш до Израел за почивка, поклонение или бизнес? С eSIM имаш мобилен интернет още от летището – без да търсиш местна SIM карта и без високи роуминг такси."
          features={[
            'Интернет в Тел Авив, Йерусалим и Мъртво море',
            'Без нужда от физическа SIM карта',
            'Запазваш българския си номер за обаждания и SMS'
          ]}
          countryName="Израел"
          countryCode="IL"
        />

        <BenefitsSection
          title="Какво представлява eSIM за Израел?"
          benefits={[
            {
              title: 'Цифрова SIM карта без пластика',
              description: '<a href="/blog/kakvo-e-esim/">eSIM е цифрова SIM карта</a>, която се инсталира чрез QR код. Няма нужда да сменяш чипа в телефона – просто сканираш, следваш няколко стъпки и получаваш мобилен интернет в Израел за минути.'
            }
          ]}
          image="/media/images/Image-1-1.png"
          imageAlt="Пътуване и карта с мобилно покритие за eSIM в Израел"
        />

        <CompactPlansSectionWrapper
          title="Избери от наличните eSIM планове с покритие в Израел"
          countryName="Израел"
          countryCode="IL"
        />

        <BenefitsSection
          title="Защо да избереш eSIM вместо роуминг в Израел?"
          benefits={[
            {
              title: 'По-ниски разходи спрямо роуминг',
              description: 'Роумингът в Израел може да бъде много скъп. С eSIM избираш предплатен пакет с фиксирана цена и знаеш точно колко ще платиш за интернет.'
            },
            {
              title: 'Работи в цялата страна',
              description: 'Пътуваш между Тел Авив, Йерусалим, Назарет или Мъртво море? eSIM плановете покриват основните туристически и бизнес зони в Израел.'
            },
            {
              title: 'Запазваш своя български номер',
              description: 'Твоят основен номер остава активен за обаждания и SMS, докато eSIM осигурява мобилните данни. Идеално за WhatsApp, Viber и навигация.'
            },
            {
              title: 'Без търсене на магазини на място',
              description: 'Купуваш и активираш eSIM още от България. При пристигане в Израел просто включваш мобилните данни и вече си онлайн.'
            }
          ]}
          image="/media/images/Esim-vs-Roaming.png"
          imageAlt="Сравнение между eSIM и роуминг при пътуване до Израел"
        />

        <HowToBuySection
          title="Как да закупите eSIM план за Израел?"
          steps={[
            {
              number: '1',
              title: 'Изберете вашия план',
              description: 'Изберете Израел като дестинация и сравнете наличните eSIM планове според дните и включените GB.',
              image: '/media/images/how-to-images/Step 1 Saily.png'
            },
            {
              number: '2',
              title: 'Инсталирайте вашия eSIM',
              description: 'След покупка ще получите имейл с QR код и инструкции. Сканирайте кода и добавете eSIM профила в настройките на телефона.',
              image: '/media/images/how-to-images/Step 2 Saily.png'
            },
            {
              number: '3',
              title: 'Активирайте при пристигане в Израел',
              description: 'Включете мобилните данни, когато кацнете в Израел, и започнете да използвате интернет. Планът се активира автоматично или до 30 дни след покупката.',
              image: '/media/images/how-to-images/Step 3 Saily.png'
            }
          ]}
          ctaUrl={checkoutUrl}
          ctaText="Купи eSIM за Израел"
        />

        <ComparisonTable
          title="eSIM vs Роуминг vs Местна SIM в Израел"
          countryName="Израел"
          rows={[
            {
              feature: 'Стартиране на услугата',
              esim: 'Онлайн покупка и активация за минути',
              roaming: 'Автоматично, но често с високи такси',
              localSim: 'Нужно е посещение в магазин в Израел'
            },
            {
              feature: 'Контрол върху разходите',
              esim: 'Фиксирана цена и предплатени данни',
              roaming: 'Трудно проследими такси за MB',
              localSim: 'Изгодно, но с договори и местни условия'
            },
            {
              feature: 'Покритие и скорост',
              esim: '4G/5G в основните градове и курорти',
              roaming: 'Зависи от българския оператор',
              localSim: 'Добро локално покритие'
            },
            {
              feature: 'Удобство',
              esim: 'Без физическа карта, всичко е дигитално',
              roaming: 'Няма настройки, но е скъпо',
              localSim: 'Нужни са паспорт и време за регистрация'
            },
            {
              feature: 'Подходящо за',
              esim: 'Туристи, поклонници и бизнес пътуващи',
              roaming: 'Кратки спешни ситуации',
              localSim: 'Дългосрочен престой в Израел'
            }
          ]}
        />

        <FAQSection
          title="Често задавани въпроси за eSIM за Израел"
          faqs={[
            {
              question: 'Трябва ли да съм в Израел, за да купя eSIM?',
              answer: 'Не. Можеш да закупиш и инсталираш eSIM за Израел още докато си в България. Планът се активира, когато пристигнеш и включиш мобилните данни.'
            },
            {
              question: 'Ще работи ли eSIM в Тел Авив и Йерусалим?',
              answer: 'Да, eSIM плановете са предназначени да работят в основните градове и туристически райони в Израел, включително Тел Авив и Йерусалим.'
            },
            {
              question: 'Мога ли да използвам eSIM само за интернет?',
              answer: 'Да. Плановете са фокусирани върху мобилни данни. За обаждания можеш да използваш WhatsApp, Viber, Telegram или други приложения.'
            },
            {
              question: 'Какво става, ако ми свършат GB-тата?',
              answer: 'Ако изчерпиш включените данни, можеш да закупиш нов eSIM план и да продължиш да използваш интернет в Израел.'
            }
          ]}
        />

        <DynamicCTASection />
      </main>
    </>
  );
}


