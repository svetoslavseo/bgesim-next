import { MetadataRoute } from 'next';
import { getPagesIndex, getPostsIndex, getPageBySlug, getPostBySlug } from '@/lib/content';
import { SITE_CONFIG } from '@/lib/seo';

/**
 * Sitemap generation for Next.js
 * 
 * This sitemap automatically includes:
 * 1. All pages from data/processed/pages-index.json
 * 2. All blog posts from data/processed/posts-index.json
 * 
 * To add a new page to the sitemap:
 * - Add the page data to data/processed/pages/[slug].json
 * - Add the page entry to data/processed/pages-index.json
 * - The page will automatically appear in the sitemap on next build
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  
  // Get all pages from the index - automatically includes all pages
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
    };
  });
  
  // Blog index page
  const blogIndex: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/blog/`,
    lastModified: new Date(),
  }];
  
  // Homepage
  const homepage: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/`,
    lastModified: new Date(),
  }];
  
  // Static pages that don't have data files but have route files
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/durjavi/`,
      lastModified: new Date(),
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



