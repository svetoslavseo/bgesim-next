import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import CompactPlansSectionWrapper from '@/components/country/CompactPlansSectionWrapper';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import DeviceCompatibility from '@/components/country/DeviceCompatibility';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';
import { getLowestPriceInBGN } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const lowestPrice = await getLowestPriceInBGN('EG');
  
  return {
    title: `eSIM за Египет: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Египет от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Египет с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-egipet'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Египет: Бърз интернет без роуминг от ${lowestPrice}лв`,
      description: `Купи eSIM за Египет от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цял Египет с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-egipet'),
    },
  };
}

export default function EgyptPage() {
  // Breadcrumb Schema for Egypt page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Египет', 'esim-egipet');
  
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
        breadcrumb="eSIM Египет"
        title="eSIM за Египет – Мобилен интернет без роуминг"
        subtitle="Пътувате до Египет? Получете бърз и надежден интернет с eSIM. Без физическа SIM карта, без високи такси за роуминг."
        features={[
          'Бързо и надеждно',
          'Работи в над 190 държави',
          'Мигновено активиране'
        ]}
        countryName="Egypt"
        countryCode="EG"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Египет?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: 'eSIM е модерна алтернатива на физическата SIM карта. Работи чрез вграден чип в телефона ви. След покупка получавате QR код, който сканирате за активация. В Египет ви дава достъп до местни мобилни мрежи за бърз и надежден интернет без високи такси за роуминг.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <BenefitsSection
        title="Защо да изберете eSIM за Египет?"
        benefits={[
          {
            title: 'Без скъп роуминг',
            description: 'Избегнете високите такси за роуминг и ползвайте местни мрежи на по-ниски цени.'
          },
          {
            title: 'Бърз 4G/5G интернет',
            description: 'Свържете се към най-добрите мрежи в Египет и използвайте интернет без прекъсвания.'
          },
          {
            title: 'Лесна активация',
            description: 'Получавате QR код по имейл, сканирате го и eSIM е готов за използване за минути.'
          },
          {
            title: 'Запазвате номера си',
            description: 'Продължавате да използвате WhatsApp, Viber и други приложения с вашия обичаен номер.'
          }
        ]}
        image="/media/images/Egypt.png"
        imageAlt="Egypt"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Египет"
        countryName="Egypt"
        countryCode="EG"
      />

      <HowToBuySection
        title="Как да закупите eSIM за Египет?"
        steps={[
          {
            number: '1',
            title: 'Изберете план',
            description: 'Изберете подходящия eSIM план според продължителността на престоя ви в Египет.'
          },
          {
            number: '2',
            title: 'Получете QR код',
            description: 'След завършване на поръчката, ще получите QR код по имейл веднага.'
          },
          {
            number: '3',
            title: 'Активирайте eSIM',
            description: 'Сканирайте QR кода в настройките на телефона си и започнете да ползвате интернет.'
          }
        ]}
        ctaUrl="https://breezesim.com/products/esimg_eg_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="Купи Сега"
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="Египет"
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
            localSim: 'Нов египетски номер'
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
            question: 'Съвместим ли е моят телефон с eSIM?',
            answer: 'Повечето нови модели iPhone (XR и по-нови), Samsung (S20 и по-нови) и Google Pixel (3 и по-нови) поддържат eSIM. Проверете в настройките на телефона си.'
          },
          {
            question: 'Мога ли да използвам eSIM за обаждания?',
            answer: 'eSIM предоставя само мобилни данни. За обаждания можете да използвате приложения като WhatsApp, Viber или Skype.'
          },
          {
            question: 'Какво става, ако изчерпам данните си?',
            answer: 'Можете да закупите нов eSIM план по всяко време и да продължите да използвате интернет.'
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

