import HeroSection from '@/components/country/HeroSection';
import BenefitsSection from '@/components/country/BenefitsSection';
import PlansSection from '@/components/country/PlansSection';
import HowToBuySection from '@/components/country/HowToBuySection';
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

