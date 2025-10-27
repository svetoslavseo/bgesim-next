import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import CompactPlansSectionWrapper from '@/components/country/CompactPlansSectionWrapper';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import FAQSection from '@/components/country/FAQSection';
import DynamicCTASection from '@/components/common/DynamicCTASection';
import { Metadata } from 'next';
import { getLowestPriceInBGN } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const lowestPrice = await getLowestPriceInBGN('GB');
  
  return {
    title: `eSIM за Великобритания: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Великобритания от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Великобритания с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-velikobritania'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Великобритания: Бърз интернет без роуминг от ${lowestPrice}лв`,
      description: `Купи eSIM за Великобритания от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Великобритания с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-velikobritania'),
    },
  };
}

export default function UKPage() {
  // Breadcrumb Schema for UK page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Великобритания', 'esim-velikobritania');
  
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
        breadcrumb="eSIM Великобритания"
        title="eSIM за Великобритания – Бърз интернет без такси за роуминг"
        subtitle="Високите сметки за роуминг могат да развалят почивката ви. С eSIM имате интернет в UK без допълнителни такси."
        features={[
          'WhatsApp без скъпи разговори в UK',
          'Данни без чакане в магазини',
          'Превключвай планове онлайн'
        ]}
        countryName="Великобритания"
        countryCode="GB"
      />

      <BenefitsSection
        title="Какво е eSIM?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: '<a href="/blog/kakvo-e-esim/">eSIM е дигитална SIM карта</a>. Не е нужно да я поставяте в телефона. Получавате QR код, сканирате го и започвате да използвате интернет. Всичко става за няколко минути.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <CompactPlansSectionWrapper
        title="Избери от всички налични eSIM планове с покритие в Великобритания"
        countryName="Великобритания"
        countryCode="GB"
      />

      <BenefitsSection
        title="Защо да изберете eSIM за Великобритания?"
        benefits={[
          {
            title: '1. Без разходи за роуминг',
            description: 'Високите сметки за роуминг могат да развалят почивката ви. С eSIM имате интернет в UK без допълнителни такси.'
          },
          {
            title: '2. Бърз и стабилен интернет',
            description: 'Свържете се с най-добрите мрежи в UK и сърфирайте без прекъсвания.'
          },
          {
            title: '3. Лесна инсталация',
            description: 'Забравете за физическите SIM карти. Получавате QR кода по имейл, сканирате го и eSIM-ът е активен.'
          },
          {
            title: '4. Съвместим с много телефони',
            description: 'Имате iPhone, Samsung, Google Pixel или друг телефон, поддържащ eSIM? Единственото, което ви трябва, е Wi-Fi връзка за активиране.'
          }
        ]}
        image="/media/images/London.png"
        imageAlt="London"
      />

      <HowToBuySection
        title="Как да закупите план за Великобритания?"
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
        ctaUrl="https://breezesim.com/products/esimg_gb_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="Купи Сега"
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="Великобритания"
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
            localSim: 'Нов британски номер'
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
        title="Често задавани въпроси за eSIM за Великобритания"
        faqs={[
          {
            question: 'Моят телефон съвместим ли е?',
            answer: 'Повечето нови модели iPhone, Samsung и Google Pixel поддържат eSIM. Проверете в настройките на телефона в „Мобилна мрежа", за да видите дали има опция за eSIM.'
          },
          {
            question: 'Мога ли да използвам eSIM за обаждания?',
            answer: 'Този eSIM е предназначен за интернет. Можете да използвате WhatsApp, Skype или Telegram за обаждания и съобщения.'
          },
          {
            question: 'Мога ли да презаредя интернет плана?',
            answer: 'Да, можете да добавите повече интернет директно от вашия акаунт.'
          }
        ]}
      />

      <DynamicCTASection />
      </main>
    </>
  );
}

