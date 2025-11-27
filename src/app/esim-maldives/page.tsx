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
  const lowestPrice = await getLowestPriceInBGN('MV');
  
  return {
    title: `eSIM за Малдиви на цени от ${lowestPrice}лв: Мобилен интернет за почивка на островите`,
    description: `Купи eSIM за Малдиви от ${lowestPrice}лв. Бърз мобилен интернет на островите и курортите – идеален за споделяне на снимки, навигация и работа от разстояние.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-maldives'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Малдиви на цени от ${lowestPrice}лв: Мобилен интернет без роуминг | Travel eSIM`,
      description: `eSIM за Малдиви със стабилен интернет по време на почивка – без роуминг такси и без търсене на местна SIM карта на летището.`,
      url: generateCanonicalUrl('/esim-maldives'),
    },
  };
}

export default async function MaldivesPage() {
  // Ценови диапазон за агрегирана оферта
  const priceRange = await getPriceRangeInBGN('MV');
  
  // Saily checkout URL за Малдиви
  const checkoutUrl = await generateCountryCheckoutUrl('MV');
  
  // Breadcrumb Schema за Малдиви
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Малдиви', 'esim-maldives');
  
  // Product Schema за Малдиви
  const productSchema = generateProductSchema({
    name: 'eSIM за Малдиви – Интернет в курортите без роуминг',
    description: 'Купи eSIM за Малдиви и се наслади на стабилен мобилен интернет в курортите и островите. Без физическа SIM карта, лесна активация и гъвкави планове за данни.',
    url: generateCanonicalUrl('/esim-maldives'),
    countryCode: 'MV',
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
          breadcrumb="eSIM Малдиви"
          title="eSIM за Малдиви – Интернет на плажа и над водните вили"
          subtitle="Почивката на Малдивите е още по-приятна, когато имаш стабилен интернет за навигация, споделяне на снимки и връзка с близките – без да плащаш скъп роуминг."
          features={[
            'Интернет в хотелите и островните курорти',
            'Без физическа SIM карта – само QR код',
            'Работи паралелно с твоята българска карта'
          ]}
          countryName="Малдиви"
          countryCode="MV"
        />

        <BenefitsSection
          title="Какво е eSIM за Малдиви и защо е удобен?"
          benefits={[
            {
              title: 'Идеален за ваканции',
              description: '<a href="/blog/kakvo-e-esim/">eSIM е дигитална SIM карта</a>, която настройваш преди пътуването. Пристигаш на Малдивите и вече имаш активен интернет за карти, чат и социални мрежи – без да търсиш местен оператор.'
            }
          ]}
          image="/media/images/PhuketThailand.png"
          imageAlt="Тропически плаж и курорт, подходящ за почивка с eSIM на Малдиви"
        />

        <CompactPlansSectionWrapper
          title="Избери от наличните eSIM планове с покритие на Малдиви"
          countryName="Малдиви"
          countryCode="MV"
        />

        <BenefitsSection
          title="Предимства на eSIM по време на почивка на Малдиви"
          benefits={[
            {
              title: 'Не зависиш само от Wi‑Fi в хотела',
              description: 'Хотелските мрежи често са бавни или несигурни. С eSIM имаш собствен мобилен интернет, който можеш да ползваш на плажа, в лодката или по време на екскурзии.'
            },
            {
              title: 'Запазваш постоянна връзка с близките',
              description: 'Използваш WhatsApp, Viber, Instagram и други приложения, за да споделяш снимки и видео в реално време – без да се притесняваш за цената на роуминга.'
            },
            {
              title: 'Лесна инсталация без магазини и договори',
              description: 'Активираш плана чрез QR код. Не подписваш договор и не търсиш SIM карти по летища и молове.'
            },
            {
              title: 'Подходящ за двойки и семейства',
              description: 'Може да комбинираш eSIM с hotspot и да споделяш интернет с близките си, ако планът го позволява.'
            }
          ]}
          image="/media/images/People-1.png"
          imageAlt="Двойка на почивка, използваща мобилен интернет чрез eSIM на Малдиви"
        />

        <HowToBuySection
          title="Как да закупите eSIM за Малдиви?"
          steps={[
            {
              number: '1',
              title: 'Изберете план според престоя',
              description: 'Изберете Малдиви като дестинация и сравнете наличните пакети според дните и включените GB.',
              image: '/media/images/how-to-images/Step 1 Saily.png'
            },
            {
              number: '2',
              title: 'Инсталирайте eSIM плана',
              description: 'След покупката ще получите имейл с QR код. Сканирайте го и следвайте стъпките в настройките на телефона си.',
              image: '/media/images/how-to-images/Step 2 Saily.png'
            },
            {
              number: '3',
              title: 'Активирайте при пристигане на Малдиви',
              description: 'Когато кацнете, включете мобилните данни за eSIM плана. Интерентът ще се активира автоматично или до 30 дни след покупката.',
              image: '/media/images/how-to-images/Step 3 Saily.png'
            }
          ]}
          ctaUrl={checkoutUrl}
          ctaText="Купи eSIM за Малдиви"
        />

        <ComparisonTable
          title="eSIM vs Роуминг vs Местна SIM на Малдиви"
          countryName="Малдиви"
          rows={[
            {
              feature: 'Инсталиране',
              esim: 'Онлайн, преди да заминеш',
              roaming: 'Активно по подразбиране, но скъпо',
              localSim: 'Изисква магазин и местен оператор'
            },
            {
              feature: 'Цена на мобилните данни',
              esim: 'Фиксирана цена за конкретен пакет',
              roaming: 'Високи такси на MB или дневни пакети',
              localSim: 'Местни цени, но с ограничения'
            },
            {
              feature: 'Подходящо за',
              esim: 'Туристи и двойки на почивка',
              roaming: 'Редки спешни случаи',
              localSim: 'По-дълъг престой или работа на място'
            },
            {
              feature: 'Удобство',
              esim: 'Няма нужда да вадиш и сменяш SIM карти',
              roaming: 'Няма настройки, но силно оскъпява',
              localSim: 'Ограничена информация на английски, формалности'
            }
          ]}
        />

        <FAQSection
          title="Често задавани въпроси за eSIM за Малдиви"
          faqs={[
            {
              question: 'Мога ли да настроя eSIM за Малдиви още от България?',
              answer: 'Да. Препоръчително е да инсталирате eSIM преди пътуването, докато имате стабилен Wi‑Fi. Така на Малдивите само включвате мобилните данни и сте готови.'
            },
            {
              question: 'Ще имам ли интернет извън хотела?',
              answer: 'Да, ако има мобилно покритие на съответния остров. eSIM разчита на местни мрежи и работи в повечето популярни курорти и райони.'
            },
            {
              question: 'Подходящ ли е eSIM за работа от разстояние?',
              answer: 'За лека работа – имейли, чат, видеосрещи с по-ниско качество – да. Ако планирате тежко видео стрийминг съдържание, изберете по-голям пакет данни.'
            },
            {
              question: 'Какво да направя, ако ми свършат данните по време на почивката?',
              answer: 'Можете да закупите допълнителен eSIM план и да продължите да използвате интернет до края на почивката си.'
            }
          ]}
        />

        <DynamicCTASection />
      </main>
    </>
  );
}


