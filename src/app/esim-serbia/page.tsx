import HeroSection from '@/components/country/HeroSection';
import BenefitsSection from '@/components/country/BenefitsSection';
import PlansSection from '@/components/country/PlansSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Купи еСИМ за Сърбия с Мобилен интернет - Travel eSIM',
  description: 'eSIM Сърбия - Travelesim.bg',
};

export default function SerbiaPage() {
  return (
    <main>
      <HeroSection
        breadcrumb="eSIM Сърбия"
        title="eSIM Сърбия"
        subtitle="Забрави за високите такси за роуминг. С eSIM картата получавате интернет веднага – без роуминг и сложни настройки!"
        features={[
          'Бързо и надеждно',
          'Работи в над 190+ държави',
          'Мигновено активиране'
        ]}
        planDetails={{
          dataRange: 'от 1GB до неограничен мобилен интернет',
          validityRange: 'от 1 до 30 дни',
          country: 'Сърбия',
          priceFrom: 'от 14 лв'
        }}
        ctaUrl="https://breezesim.com/products/esimg_rs_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        logo="/media/images/855d181a760a91a337c42ed96672a7c4_BreezeLogo-Black-1080px.png"
        trustpilot="/media/images/Screenshot-2025-03-24-at-22.50.18.png"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Сърбия?"
        benefits={[
          {
            title: 'Модерно решение за мобилна свързаност',
            description: 'eSIM е модерно решение за мобилна свързаност. Тя заменя стандартната SIM карта с вграден чип в телефона ви. След покупка получавате QR код, който сканирате, за да активирате услугата. В Сърбия това ви осигурява достъп до местни мрежи за бърз, надежден и изгоден интернет, където и да сте.'
          }
        ]}
        image="/media/images/People_1.png"
        imageAlt="eSIM People"
      />

      <PlansSection
        title="Най-популярни еСИМ планове за Сърбия?"
        lastUpdated="октомври 16, 2025"
        plans={[
          {
            name: '2GB',
            data: 'Фиксиран план за',
            validity: '15 дни',
            price: '26лв',
            ctaUrl: 'https://breezesim.com/products/esimg_rs_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: 'Неограничен',
            data: 'Фиксиран план за',
            validity: '1 ден',
            price: '20лв',
            ctaUrl: 'https://breezesim.com/products/esimg_rs_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: 'Неограничен',
            data: 'Фиксиран план за',
            validity: '5 дни',
            price: '74лв',
            ctaUrl: 'https://breezesim.com/products/esimg_rs_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          }
        ]}
      />

      <BenefitsSection
        title="Защо да избереш eSIM за Сърбия?"
        benefits={[
          {
            title: 'Без роуминг такси',
            description: 'Таксите за роуминг в Сърбия могат да бъдат изненадващо високи – особено ако идваш от ЕС, Обединеното кралство или извън Европа.'
          },
          {
            title: 'Запазваш номера си',
            description: 'Можеш да използваш датския (или другия си основен) номер за WhatsApp, iMessage и обаждания, докато eSIM се грижи за мобилните ти данни.'
          },
          {
            title: 'Мигновена активация',
            description: 'Купуваш онлайн, получаваш QR код и активираш за минути – без посещения в магазини и без документи.'
          },
          {
            title: 'Бърз 4G/5G интернет',
            description: 'Наслаждавай се на стабилна връзка в цяла Сърбия – както в големите градове, така и в по-отдалечени райони.'
          }
        ]}
        image="/media/images/Untitled_design_3.png"
        imageAlt="Serbia"
      />

      <HowToBuySection
        title="Как да си вземеш eSIM за Сърбия?"
        steps={[
          {
            number: '1',
            title: 'Избери план',
            description: 'Избери пакет с мобилни данни според престоя ти.'
          },
          {
            number: '2',
            title: 'Купи онлайн',
            description: 'Завърши поръчката и ще получиш QR код по имейл.'
          },
          {
            number: '3',
            title: 'Активирай веднага',
            description: 'Сканирай кода и инсталирай eSIM.'
          }
        ]}
      />

      <FAQSection
        title="Често задавани въпроси"
        faqs={[
          {
            question: 'Мога ли да купя eSIM за Сърбия, докато съм в България?',
            answer: 'Да! Купи и активирай преди пътуването си, за да имаш интернет веднага щом пристигнеш.'
          },
          {
            question: 'Какво става, ако свършат данните ми?',
            answer: 'Можеш да презаредиш eSIM-а си онлайн по всяко време – без да сменяш оператор.'
          },
          {
            question: 'Работи ли eSIM-ът и в други страни?',
            answer: 'Някои планове покриват и други балкански държави. Провери дали са включени Черна гора, Босна или Хърватия.'
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

