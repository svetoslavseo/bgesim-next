import { getHomepage, getRecentPosts } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import PopularDestinations from '@/components/home/PopularDestinations';
import BenefitsSection from '@/components/home/BenefitsSection';
import InfoSection from '@/components/home/InfoSection';
import WhyUsSection from '@/components/home/WhyUsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import BlogPostsSection from '@/components/home/BlogPostsSection';
import DynamicCTASection from '@/components/common/DynamicCTASection';
import { extractExcerpt, formatDate } from '@/lib/utils';
import { generateOrganizationSchema } from '@/lib/seo';
import featuredImagesMap from '../../data/processed/blog-featured-images.json';

// Lazy load non-critical sections
const LazyBenefitsSection = dynamic(() => import('@/components/home/BenefitsSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const LazyInfoSection = dynamic(() => import('@/components/home/InfoSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const LazyWhyUsSection = dynamic(() => import('@/components/home/WhyUsSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const LazyHowItWorksSection = dynamic(() => import('@/components/home/HowItWorksSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const LazyBlogPostsSection = dynamic(() => import('@/components/home/BlogPostsSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const LazyCTASection = dynamic(() => import('@/components/common/DynamicCTASection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

/**
 * Generate metadata for homepage
 */
export async function generateMetadata(): Promise<Metadata> {
  const homepage = getHomepage();
  
  if (!homepage) {
    return {
      title: 'eSIM за пътуване - Travel eSIM by Breeze',
      description: 'Останете свързани, където и да пътувате, с бърза и сигурна eSIM.',
    };
  }
  
  return generateSEOMetadata(homepage.seo);
}

/**
 * Homepage component
 */
export default function HomePage() {
  const homepage = getHomepage();
  const recentPosts = getRecentPosts(3);

  const destinations = [
    { name: 'Великобритания', href: '/esim-velikobritania/', flag: '/media/images/5.png' },
    { name: 'САЩ', href: '/esim-za-usa/', flag: '/media/images/Flags_-1.png' },
    { name: 'Тайланд', href: '/esim-thailand/', flag: '/media/images/2-1.png' },
    { name: 'Турция', href: '/turcia/', flag: '/media/images/4.png' },
    { name: 'Дубай', href: '/esim-dubai/', flag: '/media/images/6.png' },
    { name: 'Сърбия', href: '/esim-serbia/', flag: '/media/images/Flags_-2.png' },
    { name: 'Египет', href: '/esim-egipet/', flag: '/media/flags/eg.png' },
  ];

  const benefits = [
    {
      icon: '/media/images/1-150x150.png',
      title: 'Незабавно активиране',
      description: 'С eSIM активирате плана си за секунди – изтеглете приложение и настройте вашия eSIM!'
    },
    {
      icon: '/media/images/2-150x150.png',
      title: 'Спестете пари от роуминг',
      description: 'eSIM плановете са по-евтини, защото директно използват местни мрежи в избраната дестинация.'
    },
    {
      icon: '/media/images/3-150x150.png',
      title: 'Свързани навсякъде',
      description: 'Намерете най-добрите eSIM оферти от доверени доставчици и останете онлайн в над 190 държави!'
    }
  ];

  const howItWorksSteps = [
    {
      number: '1',
      title: 'Изберете вашия план',
      description: 'Изберете вашата дестинация и изберете вашия план за данни за пътуване с eSIM.',
      image: '/media/images/how-to-images/Step 1 Saily.png'
    },
    {
      number: '2',
      title: 'Изтеглете и настройте вашия eSIM',
      description: 'Настройте eSIM на вашето устройство, следвайки инструкциите в приложението.',
      image: '/media/images/how-to-images/Step 2 Saily.png'
    },
    {
      number: '3',
      title: 'Наслаждавайте се на свързаността!',
      description: 'Вашият план ще се активира, когато стигнете до дестинацията си или 30 дни след покупката.',
      image: '/media/images/how-to-images/Step 3 Saily.png'
    }
  ];

  const blogPosts = recentPosts.map(post => {
    // Get the featured image path from the mapping
    const featuredImagePath = (featuredImagesMap as Record<string, string>)[post.slug];
    
    return {
      title: post.title,
      excerpt: extractExcerpt(post.excerpt || post.content, 140),
      slug: post.slug,
      date: formatDate(post.publishedDate),
      author: 'ВАСИЛ АНДРЕЕВ',
      featuredImage: featuredImagePath || post.featuredImageUrl || undefined
    };
  });

  // Generate organization schema for homepage
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* Structured Data - Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      
      <HeroSection
        title="eSIM за пътуване"
        subtitle="Останете свързани, където и да пътувате, с бърза и сигурна eSIM. Без физически SIM карти, без забавяне – само мигновена връзка, където и да си."
      />

      <PopularDestinations destinations={destinations} />

      <LazyBenefitsSection
        title="Предимстава на eSIM"
        benefits={benefits}
        ctaText="Виж Планове"
        ctaUrl="https://breezesim.com?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
      />

      <LazyInfoSection
        title="Достъпни eSIM международни планове – без роуминг такси, без напрежение."
        description="Намерете идеалния eSIM план за вашето пътуване. Лесно, удобно и без излишни разходи – ние ви свързваме с най-добрите оферти."
        ctaText="НАУЧЕТЕ КАК РАБОТИ"
        ctaUrl="/blog/kakvo-e-esim/"
        image="/media/images/Untitled-design.png"
        imageAlt="eSIM карта"
      />

      <LazyWhyUsSection
        title="Защо да изберете нас?"
        description="Нашата цел е да направим пътуванията ви по-лесни и без излишни разходи. Платформата ни е създадена, за да ви помогне бързо да намерите правилния eSIM план. Ако имате въпроси, просто ни пишете – ще получите отговор до 48 часа."
      />

      <LazyHowItWorksSection
        title="Как работи?"
        subtitle="Нямате приложението за eSIM още? Изтеглете го от App Store или Google Play."
        steps={howItWorksSteps}
      />

      {blogPosts.length > 0 && (
        <LazyBlogPostsSection
          title="Последни публикации"
          subtitle="БЛОГ"
          posts={blogPosts}
        />
      )}

      <LazyCTASection />
    </>
  );
}
