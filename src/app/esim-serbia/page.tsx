import HeroSectionWrapper from '@/components/country/HeroSectionWrapper';
import BenefitsSection from '@/components/country/BenefitsSection';
import HowToBuySection from '@/components/country/HowToBuySection';
import ComparisonTable from '@/components/country/ComparisonTable';
import DeviceCompatibility from '@/components/country/DeviceCompatibility';
import FAQSection from '@/components/country/FAQSection';
import CTASection from '@/components/country/CTASection';
import { Metadata } from 'next';
import { getLowestPriceInBGN } from '@/lib/sailyApi';
import { generateCanonicalUrl, generateCountryBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const lowestPrice = await getLowestPriceInBGN('RS');
  
  return {
    title: `eSIM за Сърбия: Бърз интернет без роуминг от ${lowestPrice}лв`,
    description: `Купи eSIM за Сърбия от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Сърбия с 4G/5G покритие.`,
    alternates: {
      canonical: generateCanonicalUrl('/esim-serbia'),
    },
    openGraph: {
      locale: 'bg_BG',
      type: 'website',
      title: `eSIM за Сърбия: Бърз интернет без роуминг от ${lowestPrice}лв`,
      description: `Купи eSIM за Сърбия от ${lowestPrice}лв. Бърз интернет без роуминг такси. Моментална активация с QR код. Работи в цяла Сърбия с 4G/5G покритие.`,
      url: generateCanonicalUrl('/esim-serbia'),
    },
  };
}

export default function SerbiaPage() {
  // Breadcrumb Schema for Serbia page
  const breadcrumbSchema = generateCountryBreadcrumbSchema('Сърбия', 'esim-serbia');
  
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
        breadcrumb="eSIM Сърбия"
        title="eSIM Сърбия"
        subtitle="Забрави за високите такси за роуминг. С eSIM картата получавате интернет веднага – без роуминг и сложни настройки!"
        features={[
          'Бързо и надеждно',
          'Работи в над 190+ държави',
          'Мигновено активиране'
        ]}
        countryName="Serbia"
        countryCode="RS"
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

      <ComparisonTable
        title="eSIM vs Роуминг vs Местна SIM – Какво е най-добре?"
        countryName="Сърбия"
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
            localSim: 'Нов сръбски номер'
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
    </>
  );
}

