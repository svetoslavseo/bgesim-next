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
  title: 'eSIM за Турция с Мобилен Интернет: Цени от 8лв - Travel eSIM',
  description: 'eSIM Турция - Travelesim.bg',
};

export default function TurciaPage() {
  return (
    <main>
      <HeroSection
        breadcrumb="eSIM Турция"
        title="eSIM за Турция с мобилен интернет"
        subtitle="Пътувате до Турция? С eSIM картата получавате интернет веднага – без роуминг и сложни настройки!"
        features={[
          'Бързо активиране',
          'Без вадене на сегашната SIM карта',
          'Без физическа SIM карта или ходене до офиси'
        ]}
        planDetails={{
          dataRange: 'от 1GB до неограничен мобилен интернет',
          validityRange: 'от 1 до 30 дни',
          country: 'Турция',
          priceFrom: 'от 8 лв'
        }}
        ctaUrl="https://breezesim.com/products/esimg_tr_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
        logo="/media/images/855d181a760a91a337c42ed96672a7c4_BreezeLogo-Black-1080px.png"
        trustpilot="/media/images/Screenshot-2025-03-24-at-22.50.18.png"
      />

      <BenefitsSection
        title="Какво е eSIM и как работи в Турция?"
        benefits={[
          {
            title: 'Дигитална SIM карта',
            description: 'eSIM е модерно решение за мобилна свързаност. Тя заменя стандартната SIM карта с вграден чип в телефона ви. След покупка получавате QR код, който сканирате, за да активирате услугата.'
          }
        ]}
        image="/media/images/Untitled-design-2.png"
        imageAlt="eSIM визуализация"
      />

      <PlansSection
        title="Най-популярни eSim планове за Турция?"
        lastUpdated="октомври 16, 2025"
        plans={[
          {
            name: '5GB',
            data: 'Фиксиран план за',
            validity: '30 дни',
            price: '17лв',
            ctaUrl: 'https://breezesim.com/products/esimg_tr_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: '20GB',
            data: 'Фиксиран план за',
            validity: '30 дни',
            price: '38лв',
            ctaUrl: 'https://breezesim.com/products/esimg_tr_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          },
          {
            name: 'Неограничен',
            data: 'Фиксиран план за 7',
            validity: 'дни',
            price: '31лв',
            ctaUrl: 'https://breezesim.com/products/esimg_tr_v2?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg'
          }
        ]}
      />

      <BenefitsSection
        title="Защо eSIM е по-добра от стандартна SIM карта?"
        benefits={[
          {
            title: 'Изгодни цени',
            description: 'Плащате местни тарифи, които са значително по-ниски от роуминга.'
          },
          {
            title: 'Надеждна връзка',
            description: 'Стабилен интернет дори в по-отдалечени райони.'
          },
          {
            title: 'Лесно управление',
            description: 'Променяйте или подновявайте плановете си онлайн за секунди.'
          },
          {
            title: 'Сигурност',
            description: 'Няма риск да загубите или повредите картата си.'
          }
        ]}
        image="/media/images/Untitled-design-1-1.png"
        imageAlt="Turkey"
      />

      <HowToBuySection
        title="Как да закупите план за Турция?"
        steps={[
          {
            number: '1',
            title: 'Изберете вашия план',
            description: 'Разгледайте и изберете най-добрия eSIM план за вашата дестинация и нужди чрез нашата платформа.'
          },
          {
            number: '2',
            title: 'Активирайте eSIM',
            description: 'След като закупите плана, ще получите QR код от доставчика. Сканирайте го директно от телефона си, за да активирате услугата.'
          },
          {
            number: '3',
            title: 'Наслаждавайте се на пътуването',
            description: 'Вашият eSIM е готов за използване! Наслаждавайте се на бърз и достъпен интернет, без да се притеснявате за роуминг такси.'
          }
        ]}
      />

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="Турция"
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
            localSim: 'Нов турски номер'
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
            question: 'Мога ли да купя eSIM за Турция, докато съм в България?',
            answer: 'Да! Купи и активирай преди пътуването си, за да имаш интернет веднага щом пристигнеш.'
          },
          {
            question: 'Какво става, ако свършат данните ми?',
            answer: 'Можеш да презаредиш eSIM-а си онлайн по всяко време – без да сменяш оператор.'
          },
          {
            question: 'Работи ли eSIM-ът в цяла Турция?',
            answer: 'Да, eSIM-ът работи навсякъде в Турция с добро мобилно покритие.'
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

