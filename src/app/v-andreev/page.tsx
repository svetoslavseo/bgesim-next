import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import AuthorProfile from '@/components/author/AuthorProfile';

export async function generateMetadata(): Promise<Metadata> {
  const authorPage = getPageBySlug('v-andreev');
  
  if (authorPage) {
    return generateSEOMetadata(authorPage.seo);
  }
  
  // Fallback metadata if author page data is not available
  return {
    title: 'Основател на Travel eSIM Global - Travel eSIM',
    description: 'Васил Андреев - Travel eSIM BG',
    alternates: {
      canonical: 'https://travelesim.bg/v-andreev/',
    },
    openGraph: {
      title: 'Основател на Travel eSIM Global - Travel eSIM',
      description: 'Васил Андреев - Travel eSIM BG',
      type: 'article',
      url: 'https://travelesim.bg/v-andreev/',
      images: [
        {
          url: 'https://travelesim.bg/media/images/vasil-andreev-768x1024.jpeg',
          width: 768,
          height: 1024,
          alt: 'Васил Андреев'
        }
      ]
    }
  };
}

// Latest blog posts data
const latestPosts = [
  {
    slug: 'kak-da-proverq-dali-imam-rouming',
    title: 'Как да проверя дали имам роуминг? Практично ръководство за Vivacom, Yettel и A1',
    publishedDate: '2025-10-19T19:58:56',
    excerpt: 'Когато пътуваме в чужбина, едно от първите неща, за които се замисляме, е дали имаме активиран роуминг. Ако не проверите това предварително, може да останете без връзка точно когато най-много ви трябва интернет или обаждане. В тази статия ще разгледаме как да проверите дали имате роуминг при трите основни мобилни оператора в България – Vivacom, […]'
  },
  {
    slug: 'kak-da-izbegnesh-rouming-v-velikobritania',
    title: 'Как да избегнеш скъп роуминг във Великобритания с eSIM (2025)',
    publishedDate: '2025-10-14T09:33:32',
    excerpt: 'Пътуваш до Великобритания и искаш да използваш Интернет, без да се ужилиш от сметка?С Брекзит (Brexit) роумингът за UK вече не е „като у дома". Трябва да провериш тарифите си и да се подготвиш.Но има добри новини - eSIM може да ти даде по-евтин и по-удобен вариант за мобилен интернет. Без да вадиш сегашната си […]'
  },
  {
    slug: 'rouming-v-syrbia-ceni-paketi-esim-alternativi',
    title: 'Роуминг в Сърбия: Пълно ръководство за пътуващи',
    publishedDate: '2025-08-13T12:27:11',
    excerpt: 'Планираш пътуване до Сърбия и се чудиш как да останеш онлайн? В тази статия ще откриеш всичко важно за роуминг услугите, цените, алтернативите и най-добрите начини да спестиш пари, без да губиш връзка. 1. Роуминг от България към Сърбия Сърбия не е част от ЕС, което означава, че стандартните правила за безплатен роуминг в ЕС […]'
  }
];

export default function VasilAndreevPage() {
  const authorData = {
    authorName: "Васил Андреев",
    authorTitle: "Основател на Travel eSIM Global",
    authorImage: "/media/images/vasil-andreev-768x1024.jpeg",
    authorBio: [
      "Здравейте и добре дошли в моята страница за пътувания! Аз съм Васил Андреев, 25-годишен любител на приключенията, който обожава да открива света с ограничен бюджет. През последните няколко години усъвършенствах уменията си в SEO, но истинската ми страст е потапянето в нови култури и места.",
      "Вдъхновен от номадския начин на живот, създадох Travel eSIM, за да помогна на пътешественици да спестяват пари от роуминг такси. С натрупан опит от самостоятелни пътувания из Европа и Азия, с удоволствие ще споделя съвети и преживявания. Присъединете се към мен, докато откривам света – едно достъпно пътуване след друго!"
    ],
    linkedinUrl: "https://linkedin.com/in/vasil-andreev",
    latestPosts
  };

  // ProfilePage structured data according to Google's guidelines
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": authorData.authorName,
      "jobTitle": authorData.authorTitle,
      "image": {
        "@type": "ImageObject",
        "url": `https://travelesim.bg${authorData.authorImage}`,
        "contentUrl": `https://travelesim.bg${authorData.authorImage}`
      },
      "description": authorData.authorBio.join(" "),
      "sameAs": [
        authorData.linkedinUrl,
        "https://travelesimple.com/author/vasil-andreev",
        "https://travelesim.ro/andreev/",
        "https://travelesim.dk/v-andreev/"
      ],
      "url": "https://travelesim.bg/v-andreev/",
      "worksFor": {
        "@type": "Organization",
        "name": "Travel eSIM Global",
        "alternateName": "Travel eSIM BG",
        "url": "https://travelesim.bg/"
      },
      "knowsAbout": [
        "SEO",
        "eSIM",
        "Travel",
        "Mobile Technology",
        "Digital Marketing",
        "Roaming"
      ],
      "additionalType": [
        "https://schema.org/Blogger",
        "https://schema.org/Entrepreneur"
      ]
    }
  };

  return (
    <>
      {/* Structured Data - ProfilePage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema),
        }}
      />
      <AuthorProfile {...authorData} />
    </>
  );
}
