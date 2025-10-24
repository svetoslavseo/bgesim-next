import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import DeviceCompatibility from '@/components/country/DeviceCompatibility';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';
import { getLowestPriceInBGN } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema } from '@/lib/seo';

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
      title: `eSIM за Тайланд: Бърз интернет без роуминг от ${lowestPrice}лв`,
      description: `Купи eSIM за Тайланд от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Тайланд с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-thailand'),
    },
  };
}

export default function ThailandPage() {
  // Breadcrumb Schema for Thailand page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Тайланд', 'esim-thailand');
  
  return (
    <>
      {/* Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      <main>
      <HeroSectionWrapper
        breadcrumb="eSIM Тайланд"
        title="eSIM за Тайланд – Надежден и бърз мобилен интернет"
        subtitle="Ще пътуваш до Тайланд? Купи eSIM с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори."
        features={[
          'Бързо и надеждно',
          'Работи в над 190 държави',
          'Мигновено активиране'
        ]}
        countryName="Thailand"
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
        title="Как работи eSIM за Тайланд?"
        steps={[
          {
            number: '1',
            title: 'Купуваш предплатен план',
            description: 'Избираш най-подходящия вариант за престоя ти в Тайланд.'
          },
          {
            number: '2',
            title: 'Получаваш QR код',
            description: 'Този QR код ще го получиш на имейла.'
          },
          {
            number: '3',
            title: 'Сканираш кода',
            description: 'Следваш инструкциите за инсталация и вече имаш интернет навсякъде в Тайланд.'
          }
        ]}
        ctaUrl="https://breezesim.com/products/esimg_th_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="Купи Сега"
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="Тайланд"
        rows={[
          {
            feature: 'Активация',
            esim: 'Мигновена с QR код',
            roaming: 'Автоматична, но скъпа',
            localSim: 'Изисква магазин'
          },
          {
            feature: 'Цена',
            esim: 'Изгодни предплатени планове',
            roaming: 'Обикновено €5–€12/ден или повече',
            localSim: 'Евтина, но може да изисква регистрация'
          },
          {
            feature: 'Интернет скорост',
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
            feature: 'Удобство',
            esim: 'Изцяло дигитално',
            roaming: 'Лесно, но скъпо',
            localSim: 'Изисква лично посещение'
          },
          {
            feature: 'Подходящо за',
            esim: 'Повечето пътешественици',
            roaming: 'Само за спешни случаи',
            localSim: 'Бюджетни пътувания с дълъг престой'
          }
        ]}
      />

      <DeviceCompatibility
        title="Съвместим ли е телефонът ти с eSIM?"
        description="Повечето съвременни телефони поддържат eSIM. Провери в: Настройки → Мобилни данни → Добавяне на eSIM"
        devices={[
          'iPhone – XR, XS и по-нови',
          'Samsung – Galaxy S20 и по-нови',
          'Google Pixel – Pixel 3 и по-нови',
          'Други – Провери настройките на устройството си'
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

      <CTASection
        title="Купи своята eSIM карта сега и спести пари от роуминг."
        description="Бързо и сигурно свързване, без нуждата да вадите сегашната SIM карта от телефона. Гарантирано ниски цени от 15лв за 5GB."
        ctaUrl="https://breezesim.com/?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="КУПИ СЕГА"
        variant="purple"
      />
      </main>
    </>
  );
}

