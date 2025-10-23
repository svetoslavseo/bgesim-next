import HeroSection from '@/components/country/HeroSection';
import BenefitsSection from '@/components/country/BenefitsSection';
import PlansSection from '@/components/country/PlansSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Купи eSIM за Тайланд (Бърз интернет без роуминг) - Travel eSIM',
  description: 'eSIM за Тайланд - Travelesim.bg',
};

export default function ThailandPage() {
  return (
    <main>
      <HeroSection
        breadcrumb="eSIM Тайланд"
        title="eSIM за Тайланд – Надежден и бърз мобилен интернет"
        subtitle="Ще пътуваш до Тайланд? Купи eSIM с бърз и надежден мобилен интернет. Без физическа SIM карта. Без дългосрочни договори."
        features={[
          'Бързо и надеждно',
          'Работи в над 190 държави',
          'Мигновено активиране'
        ]}
        planDetails={{
          dataRange: 'от 5 ГБ до неограничен интернет',
          validityRange: 'от 1 до 30 дни',
          country: 'Тайланд',
          priceFrom: 'от 15лв'
        }}
        ctaUrl="https://breezesim.com/products/esimg_th_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        logo="/media/images/855d181a760a91a337c42ed96672a7c4_BreezeLogo-Black-1080px.png"
        trustpilot="/media/images/Screenshot-2025-03-24-at-22.50.18.png"
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

      <PlansSection
        title="Избери подходящия план за теб"
        lastUpdated="март 16, 2025"
        plans={[
          {
            name: '1 GB / 7 дни',
            data: '',
            validity: '',
            price: 'Идеален за чат и проверка на имейли',
            ctaUrl: 'https://breezesim.com/products/esimg_th_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '3 GB / 15 дни',
            data: '',
            validity: '',
            price: 'Перфектен за социални мрежи',
            ctaUrl: 'https://breezesim.com/products/esimg_th_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '5 GB / 30 дни',
            data: '',
            validity: '',
            price: 'За стрийминг и работа',
            ctaUrl: 'https://breezesim.com/products/esimg_us_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          }
        ]}
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
  );
}

