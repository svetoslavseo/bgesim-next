import { MetadataRoute } from 'next';
import { getPagesIndex, getPostsIndex, getPageBySlug, getPostBySlug } from '@/lib/content';
import { SITE_CONFIG } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  
  // Get all pages with their actual modified dates
  const pages = getPagesIndex();
  const pageUrls: MetadataRoute.Sitemap = pages.map((page) => {
    // Get the full page data to access modifiedDate
    const pageData = getPageBySlug(page.slug);
    const lastModified = pageData?.modifiedDate 
      ? new Date(pageData.modifiedDate) 
      : new Date();
    
    const slug = page.slug === 'home' || page.slug === '' || page.slug === 'en' ? '' : page.slug;
    const url = slug ? `${baseUrl}/${slug}/` : `${baseUrl}/`;
    
    return {
      url,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: page.slug === 'home' || page.slug === '' || page.slug === 'en' ? 1.0 : 0.8,
    };
  });
  
  // Get all posts with their actual modified dates
  const posts = getPostsIndex();
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => {
    // Use modifiedDate if available, otherwise use publishedDate
    const postData = getPostBySlug(post.slug);
    const lastModified = postData?.modifiedDate 
      ? new Date(postData.modifiedDate) 
      : new Date(post.publishedDate);
    
    return {
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });
  
  // Blog index page
  const blogIndex: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/blog/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }];
  
  // Homepage
  const homepage: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }];
  
  // Static pages that don't have data files but have route files
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/durjavi/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/checkout/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];
  
  return [
    ...homepage,
    ...pageUrls,
    ...blogIndex,
    ...postUrls,
    ...staticPages,
  ];
}



