import HeroSection from '@/components/country/HeroSection';
import BenefitsSection from '@/components/country/BenefitsSection';
import PlansSection from '@/components/country/PlansSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eSIM за Египет: Купи Мобилен Интернет за Египет - Travel eSIM',
  description: 'eSIM за Египет - Travelesim.bg',
};

export default function EgyptPage() {
  return (
    <main>
      <HeroSection
        breadcrumb="eSIM Египет"
        title="eSIM за Египет – Мобилен интернет без роуминг"
        subtitle="Пътувате до Египет? Получете бърз и надежден интернет с eSIM. Без физическа SIM карта, без високи такси за роуминг."
        features={[
          'Бързо и надеждно',
          'Работи в над 190 държави',
          'Мигновено активиране'
        ]}
        planDetails={{
          dataRange: 'от 1 GB до неограничен интернет',
          validityRange: 'от 1 до 30 дни',
          country: 'Египет',
          priceFrom: 'от 10лв'
        }}
        ctaUrl="https://breezesim.com/products/esimg_eg_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        logo="/media/images/855d181a760a91a337c42ed96672a7c4_BreezeLogo-Black-1080px.png"
        trustpilot="/media/images/Screenshot-2025-03-24-at-22.50.18.png"
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

      <PlansSection
        title="Избери най-добрия eSIM план за Египет"
        lastUpdated="октомври 16, 2025"
        plans={[
          {
            name: '7 дни',
            data: '',
            validity: '',
            price: 'Идеален за кратки почивки',
            ctaUrl: 'https://breezesim.com/products/esimg_eg_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '15 дни',
            data: '',
            validity: '',
            price: 'Перфектен за по-дълги почивки',
            ctaUrl: 'https://breezesim.com/products/esimg_eg_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '30 дни',
            data: '',
            validity: '',
            price: 'За продължителен престой',
            ctaUrl: 'https://breezesim.com/products/esimg_eg_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          }
        ]}
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
  );
}

