import HeroSection from '@/components/country/HeroSection';
import BenefitsSection from '@/components/country/BenefitsSection';
import PlansSection from '@/components/country/PlansSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eSIM Дубай – Бърз Мобилен Интернет без Роуминг - Travel eSIM',
  description: 'eSIM за Дубай - Travelesim.bg',
};

export default function DubaiPage() {
  return (
    <main>
      <HeroSection
        breadcrumb="eSIM Дубай"
        title="eSIM за Дубай"
        subtitle="С eSIM получаваш интернет веднага – без нужда от физическа SIM карта или посещение в магазин. Получаваш QR код по имейл, сканираш го и се свързваш за минути."
        features={[
          'Бързо и надеждно',
          'Работи в над 190 държави',
          'Мигновено активиране'
        ]}
        planDetails={{
          dataRange: 'от 1 GB до неограничен интернет',
          validityRange: 'от 1 до 30 дни',
          country: 'Дубай',
          priceFrom: 'от 8лв'
        }}
        ctaUrl="https://breezesim.com/products/esimg_ae_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        logo="/media/images/855d181a760a91a337c42ed96672a7c4_BreezeLogo-Black-1080px.png"
        trustpilot="/media/images/Screenshot-2025-03-24-at-22.50.18.png"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Дубай?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: 'eSIM е дигитална SIM карта. Не ти трябва пластика или чип. След като направиш поръчка, получаваш QR код по имейл. Сканираш го с телефона си и активираш интернет плана за няколко минути. В Дубай това е практичен избор – не губиш време в търсене на магазини или попълване на документи. Всичко става онлайн и бързо.'
          }
        ]}
        image="/media/images/People-1.png"
        imageAlt="eSIM People"
      />

      <PlansSection
        title="Популярни eSIM планове за Дубай"
        lastUpdated="март 24, 2025"
        plans={[
          {
            name: '7 дни',
            data: '',
            validity: '',
            price: 'Достатъчен за карти и социални мрежи',
            ctaUrl: 'https://breezesim.com/products/esimg_ae_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '15 дни',
            data: '',
            validity: '',
            price: 'Повече данни за видеочат',
            ctaUrl: 'https://breezesim.com/products/esimg_ae_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '30 дни',
            data: '',
            validity: '',
            price: 'За дистанционна работа',
            ctaUrl: 'https://breezesim.com/products/esimg_ae_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          }
        ]}
      />

      <BenefitsSection
        title="Предимства на eSIM в Дубай"
        benefits={[
          {
            title: '1. Без роуминг такси',
            description: 'Плащаш фиксирана цена и знаеш точно какво получаваш. Без изненадващи сметки.'
          },
          {
            title: '2. Бърз и стабилен интернет',
            description: 'Свързваш се към местни мобилни мрежи с добро покритие – 4G или 5G в Дубай Марина, Дубай Мол, Палм Джумейра и други популярни места.'
          },
          {
            title: '3. Активиране без усилие',
            description: 'Получаваш QR код по имейл. Сканираш го и следваш няколко стъпки в настройките. Няма нужда от техническа помощ.'
          },
          {
            title: '4. Съвместимост с модерни телефони',
            description: 'Ако имаш iPhone XS или по-нов, Samsung Galaxy S20 или Google Pixel от последните години – eSIM ще работи.'
          }
        ]}
        image="/media/images/Untitled_design_2-1.png"
        imageAlt="Dubai"
      />

      <HowToBuySection
        title="Как да поръчаш и активираш eSIM?"
        steps={[
          {
            number: '1',
            title: 'Избери подходящия план',
            description: 'Избери подходящия план според продължителността на пътуването.'
          },
          {
            number: '2',
            title: 'Получаваш eSIM-а по имейл',
            description: 'Получаваш QR код и инструкции по имейл.'
          },
          {
            number: '3',
            title: 'Сканираш и активираш',
            description: 'Сканираш кода с телефона си и активираш връзката. Интернетът тръгва веднага.'
          }
        ]}
        ctaUrl="https://breezesim.com/products/esimg_ae_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        ctaText="Купи Сега"
      />

      <FAQSection
        title="Често задавани въпроси"
        faqs={[
          {
            question: 'Моят телефон съвместим ли е с eSIM?',
            answer: 'Ако устройството ти е пуснато след 2018 г. (напр. iPhone XS, Galaxy S20, Pixel 4), eSIM трябва да работи. Виж пълния списък на сайта.'
          },
          {
            question: 'Мога ли да извършвам обаждания?',
            answer: 'Плановете включват само мобилен интернет. За разговори можеш да използваш WhatsApp, Viber и други приложения.'
          },
          {
            question: 'Мога ли да закупя нов план, ако изчерпам данните си?',
            answer: 'Да, можеш да закупиш нов пакет по всяко време със същата процедура.'
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

