/**
 * Content loading utilities
 * Functions to load and access processed WordPress content
 */

import fs from 'fs';
import path from 'path';
import type { ProcessedPage, ProcessedPost, PageIndex, PostIndex } from '@/types/content';

const DATA_DIR = path.join(process.cwd(), 'data', 'processed');

/**
 * Load all pages index
 */
export function getPagesIndex(): PageIndex[] {
  const indexPath = path.join(DATA_DIR, 'pages-index.json');
  
  if (!fs.existsSync(indexPath)) {
    return [];
  }
  
  const data = fs.readFileSync(indexPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Load all posts index
 */
export function getPostsIndex(): PostIndex[] {
  const indexPath = path.join(DATA_DIR, 'posts-index.json');
  
  if (!fs.existsSync(indexPath)) {
    return [];
  }
  
  const data = fs.readFileSync(indexPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Load a single page by slug
 */
export function getPageBySlug(slug: string): ProcessedPage | null {
  const pagePath = path.join(DATA_DIR, 'pages', `${slug}.json`);
  
  if (!fs.existsSync(pagePath)) {
    return null;
  }
  
  const data = fs.readFileSync(pagePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Load a single post by slug
 */
export function getPostBySlug(slug: string): ProcessedPost | null {
  const postPath = path.join(DATA_DIR, 'posts', `${slug}.json`);
  
  if (!fs.existsSync(postPath)) {
    return null;
  }
  
  const data = fs.readFileSync(postPath, 'utf-8');
  const post = JSON.parse(data) as ProcessedPost;
  
  // Extract featured image URL from SEO metadata if not already set
  if (!post.featuredImageUrl && post.seo?.openGraph?.images?.[0]?.url) {
    post.featuredImageUrl = post.seo.openGraph.images[0].url;
  }
  
  return post;
}

/**
 * Get all page slugs for static generation
 */
export function getAllPageSlugs(): string[] {
  const pagesDir = path.join(DATA_DIR, 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    return [];
  }
  
  return fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  const postsDir = path.join(DATA_DIR, 'posts');
  
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  
  return fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): ProcessedPost[] {
  const posts = getPostsIndex();
  const postSlugs = posts
    .filter(post => post.categories.includes(category))
    .map(post => post.slug);
  
  return postSlugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is ProcessedPost => post !== null);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): ProcessedPost[] {
  const allPostSlugs = getAllPostSlugs();
  
  return allPostSlugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is ProcessedPost => 
      post !== null && post.tags.includes(tag)
    );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const posts = getPostsIndex();
  const categories = new Set<string>();
  
  posts.forEach(post => {
    post.categories.forEach(cat => categories.add(cat));
  });
  
  return Array.from(categories).sort();
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allPostSlugs = getAllPostSlugs();
  const tags = new Set<string>();
  
  allPostSlugs.forEach(slug => {
    const post = getPostBySlug(slug);
    if (post) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return Array.from(tags).sort();
}

/**
 * Get recent posts
 */
export function getRecentPosts(limit: number = 10): ProcessedPost[] {
  const posts = getPostsIndex();
  
  return posts
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit)
    .map(post => getPostBySlug(post.slug))
    .filter((post): post is ProcessedPost => post !== null);
}

/**
 * Search posts by title or content
 */
export function searchPosts(query: string): ProcessedPost[] {
  const allPostSlugs = getAllPostSlugs();
  const lowerQuery = query.toLowerCase();
  
  return allPostSlugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is ProcessedPost => {
      if (!post) return false;
      
      return (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery)
      );
    });
}

/**
 * Get homepage data
 */
export function getHomepage(): ProcessedPage | null {
  // Try to find home page by common slugs
  const homeVariants = ['home', 'homepage', 'index', '', 'en'];
  
  for (const slug of homeVariants) {
    const page = getPageBySlug(slug);
    if (page) return page;
  }
  
  // If no specific home page, return the first page
  const slugs = getAllPageSlugs();
  if (slugs.length > 0 && slugs[0]) {
    return getPageBySlug(slugs[0]);
  }
  
  return null;
}


