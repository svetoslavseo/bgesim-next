import { Metadata } from 'next';
import { getPageBySlug, getRecentPosts } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import AuthorProfile from '@/components/author/AuthorProfile';

export async function generateMetadata(): Promise<Metadata> {
  const authorPage = getPageBySlug('v-andreev');
  
  if (authorPage) {
    return generateSEOMetadata(authorPage.seo);
  }
  
  // Fallback metadata if author page data is not available
  return {
    title: 'Основател на Travel eSIM Global',
    description: 'Васил Андреев - Travel eSIM BG',
    alternates: {
      canonical: 'https://travelesim.bg/v-andreev/',
    },
    openGraph: {
      title: 'Основател на Travel eSIM Global | Travel eSIM',
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

export default function VasilAndreevPage() {
  // Get all published articles, sorted by published date (newest first)
  // Using a high limit to ensure we get all posts
  const allPosts = getRecentPosts(10000);
  
  // Map to the format expected by AuthorProfile component
  const latestPosts = allPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    publishedDate: post.publishedDate,
    excerpt: post.excerpt
  }));

  const authorData = {
    authorName: "Васил Андреев",
    authorTitle: "Основател на Travel eSIM Global",
    authorImage: "/media/images/vasil-andreev-768x1024.jpeg",
    authorBio: [
      "Здравейте и добре дошли в моята страница за пътувания! Аз съм Васил Андреев, 25-годишен любител на приключенията, който обожава да открива света с ограничен бюджет. През последните няколко години усъвършенствах уменията си в SEO, но истинската ми страст е потапянето в нови култури и места.",
      "Вдъхновен от номадския начин на живот, създадох Travel eSIM, за да помогна на пътешественици да спестяват пари от роуминг такси. С натрупан опит от самостоятелни пътувания из Европа и Азия, с удоволствие ще споделя съвети и преживявания. Присъединете се към мен, докато откривам света – едно достъпно пътуване след друго!"
    ],
    linkedinUrl: "https://www.linkedin.com/in/vasil-andreev-b34142219/",
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
