import HeroSection from '@/components/country/HeroSection';
import BenefitsSection from '@/components/country/BenefitsSection';
import PlansSection from '@/components/country/PlansSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eSIM за Америка: Мобилен интернет на Цени от 8лв - Travel eSIM',
  description: 'eSIM за САЩ - Travelesim.bg',
};

export default function USAPage() {
  return (
    <main>
      <HeroSection
        breadcrumb="eSIM САЩ"
        title="Купи eSIM за САЩ - Мобилен интернет без роуминг"
        subtitle="eSIM е дигитална SIM карта, която не е нужно да я поставяш в телефона. Активираш я с QR код и се свързваш с интернет в САЩ без да сменяш физическата карта."
        features={[
          'Бързо и надеждно',
          'Работи в над 200 държави',
          'Мигновено активиране'
        ]}
        planDetails={{
          dataRange: 'от 1 ГБ до неограничен мобилен интернет',
          validityRange: 'от 1 до 30 дни',
          country: 'САЩ',
          priceFrom: 'от 8 лв'
        }}
        ctaUrl="https://breezesim.com/products/esimg_us_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        logo="/media/images/855d181a760a91a337c42ed96672a7c4_BreezeLogo-Black-1080px.png"
        trustpilot="/media/images/Screenshot-2025-03-24-at-22.50.18.png"
      />

      <BenefitsSection
        title="Какво е eSIM и защо е подходящо при пътуване до Америка?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: 'eSIM е дигитална SIM карта, която не е нужно да я поставяш в телефона. Активираш я с QR код и се свързваш с интернет в САЩ без да сменяш физическата карта. Лесно и бързо и значително по-евтино от роуминг.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM visualization"
      />

      <PlansSection
        title="Избери подходящия план за теб"
        lastUpdated="октомври 16, 2025"
        plans={[
          {
            name: '2 GB / 15 дни',
            data: '',
            validity: '',
            price: 'Идеален за чат и проверка на имейли',
            ctaUrl: 'https://breezesim.com/products/esimg_us_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '10 GB / 30 дни',
            data: '',
            validity: '',
            price: 'Перфектен за социални мрежи',
            ctaUrl: 'https://breezesim.com/products/esimg_us_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: 'Неограничен / 10 дни',
            data: '',
            validity: '',
            price: 'За стрийминг и работа',
            ctaUrl: 'https://breezesim.com/products/esimg_us_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          }
        ]}
      />

      <BenefitsSection
        title="Защо да избереш eSIM за САЩ?"
        benefits={[
          {
            title: '1. Моментална активация',
            description: 'Получаваш eSIM по имейл и го инсталираш за минути. Без ходене до офиси на мобилни оператори.'
          },
          {
            title: '2. Предплатени данни',
            description: 'Плащаш само за данните, които използваш. Данните са предплатени и няма опасност за надвишаване на сметки и изненади в месечната такса.'
          },
          {
            title: '3. Стабилен и бърз интернет',
            description: '4G/LTE покритие във всички щати и градове.'
          },
          {
            title: '4. Запазваш българския си номер',
            description: 'Използваш WhatsApp и други приложения без проблеми.'
          }
        ]}
        image="/media/images/pexels-pixabay-356844-scaled.jpg"
        imageAlt="USA"
      />

      <HowToBuySection
        title="Как работи eSIM за САЩ?"
        steps={[
          {
            number: '1',
            title: 'Купуваш предплатен план',
            description: 'Избираш най-подходящия вариант за престоя ти в Америка.'
          },
          {
            number: '2',
            title: 'Получаваш QR код',
            description: 'Изпращаме го по имейл веднага.'
          },
          {
            number: '3',
            title: 'Сканираш кода',
            description: 'Следваш инструкциите за инсталация и вече имаш интернет навсякъде в САЩ.'
          }
        ]}
        ctaUrl="https://breezesim.com/products/esimg_us_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="Купи Сега"
      />

      <FAQSection
        title="Често задавани въпроси"
        faqs={[
          {
            question: 'Мога ли да използвам eSIM на няколко устройства?',
            answer: 'Не, eSIM може да бъде активиран само на един телефон.'
          },
          {
            question: 'Мога ли да правя обаждания и да изпращам SMS с eSIM?',
            answer: 'eSIM осигурява само мобилни данни. Можеш да използваш WhatsApp, Telegram или Skype за обаждания.'
          },
          {
            question: 'Какво да направя, ако изразходвам данните си?',
            answer: 'Можеш да закупиш нов eSIM и да продължиш да сърфираш.'
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

