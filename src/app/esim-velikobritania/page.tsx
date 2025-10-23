import HeroSection from '@/components/country/HeroSection';
import BenefitsSection from '@/components/country/BenefitsSection';
import PlansSection from '@/components/country/PlansSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import DeviceCompatibility from '@/components/country/DeviceCompatibility';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eSIM за Великобритания: Бърз интернет без роуминг Цени от 10лв - Travel eSIM',
  description: 'eSIM за Великобритания - Travelesim.bg',
};

export default function UKPage() {
  return (
    <main>
      <HeroSection
        breadcrumb="eSIM Великобритания"
        title="eSIM за Великобритания – Бърз интернет без такси за роуминг"
        subtitle="Високите сметки за роуминг могат да развалят почивката ви. С eSIM имате интернет в UK без допълнителни такси."
        features={[
          'Бързо и надеждно',
          'Работи в над 190 държави',
          'Мигновено активиране'
        ]}
        planDetails={{
          dataRange: 'от 5 ГБ до неограничен интернет',
          validityRange: 'от 1 до 30 дни',
          country: 'Великобритания',
          priceFrom: 'от 10 лв'
        }}
        ctaUrl="https://breezesim.com/products/esimg_gb_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        logo="/media/images/855d181a760a91a337c42ed96672a7c4_BreezeLogo-Black-1080px.png"
        trustpilot="/media/images/Screenshot-2025-03-24-at-22.50.18.png"
      />

      <BenefitsSection
        title="Какво е eSIM?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: 'eSIM е дигитална SIM карта. Не е нужно да я поставяте в телефона. Получавате QR код, сканирате го и започвате да използвате интернет. Всичко става за няколко минути.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <PlansSection
        title="Най-добрите eSIM пакети за Великобритания"
        lastUpdated="октомври 16, 2025"
        plans={[
          {
            name: '7 дни',
            data: '',
            validity: '',
            price: 'Идеален за кратки пътувания',
            ctaUrl: 'https://breezesim.com/products/esimg_gb_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '15 дни',
            data: '',
            validity: '',
            price: 'Перфектен за по-дълги пътешествия',
            ctaUrl: 'https://breezesim.com/products/esimg_gb_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '30 дни',
            data: '',
            validity: '',
            price: 'За продължителен престой',
            ctaUrl: 'https://breezesim.com/products/esimg_gb_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          }
        ]}
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
        title="Как да получите eSIM за Великобритания?"
        steps={[
          {
            number: '1',
            title: 'Изберете интернет пакет',
            description: 'Изберете опция, която отговаря на вашето пътуване. Гъвкави планове за кратки ваканции или по-дълъг престой.'
          },
          {
            number: '2',
            title: 'Получавате eSIM-а по имейл',
            description: 'След плащане ще получите QR код. Не е нужно да чакате физическа доставка.'
          },
          {
            number: '3',
            title: 'Сканирайте и активирайте',
            description: 'Отворете настройките на телефона, изберете „Добавяне на eSIM" и сканирайте QR кода. След секунди сте онлайн.'
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
            localSim: 'Нов британски номер'
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

      <CTASection
        title="Купи своята eSIM карта сега и спести пари от роуминг."
        description="Бързо и сигурно свързване, без нуждата да вадите сегашната SIM карта от телефона. Гарантирано ниски цени от 15лв за 5GB."
        ctaUrl="https://breezesim.com/?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="КУПИ СЕГА"
        variant="purple"
      />
    </main>
  );
}

