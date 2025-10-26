import { MetadataRoute } from 'next';
import { getPagesIndex, getPostsIndex } from '@/lib/content';
import { SITE_CONFIG } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  
  // Get all pages
  const pages = getPagesIndex();
  const pageUrls: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}${page.slug === 'home' || page.slug === '' ? '/' : `/${page.slug}/`}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: page.slug === 'home' || page.slug === '' ? 1.0 : 0.8,
  }));
  
  // Get all posts
  const posts = getPostsIndex();
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  
  // Blog index page
  const blogIndex: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/blog/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }];
  
  // Durjavi page
  const durjaviPage: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/durjavi/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }];
  
  return [
    ...pageUrls,
    ...blogIndex,
    ...durjaviPage,
    ...postUrls,
  ];
}



