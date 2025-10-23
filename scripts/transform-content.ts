/**
 * Content Transformation Script
 * Transforms WordPress data to Next.js-compatible format
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const RAW_DIR = path.join(DATA_DIR, 'raw');
const PROCESSED_DIR = path.join(DATA_DIR, 'processed');
const SCRAPED_DIR = path.join(DATA_DIR, 'scraped');

interface ProcessedPage {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  seo: any;
  url: string;
  modifiedDate: string;
  publishedDate: string;
}

interface ProcessedPost extends ProcessedPage {
  author: string;
  categories: string[];
  tags: string[];
}

/**
 * Ensure directory exists
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Load media mapping for URL transformation
 */
function loadMediaMapping(): { [key: string]: string } {
  const mappingPath = path.join(RAW_DIR, 'media-mapping.json');
  if (fs.existsSync(mappingPath)) {
    return JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  }
  return {};
}

/**
 * Transform image URLs in content
 */
function transformImageUrls(content: string, mediaMapping: { [key: string]: string }): string {
  let transformedContent = content;

  for (const [oldUrl, newUrl] of Object.entries(mediaMapping)) {
    transformedContent = transformedContent.replace(new RegExp(oldUrl, 'g'), newUrl);
  }

  // Also replace WordPress domain with relative paths
  transformedContent = transformedContent.replace(/https?:\/\/travelesim\.bg\/wp-content\/uploads\//g, '/media/images/');

  return transformedContent;
}

/**
 * Transform internal links
 */
function transformInternalLinks(content: string, baseUrl: string = 'https://travelesim.bg'): string {
  // Replace absolute WordPress URLs with relative Next.js paths
  let transformedContent = content;
  
  // Remove base URL from links
  transformedContent = transformedContent.replace(
    new RegExp(`${baseUrl}`, 'g'),
    ''
  );

  // Ensure trailing slashes for consistency
  transformedContent = transformedContent.replace(/href="\/([^"\/]+)"/g, 'href="/$1/"');

  return transformedContent;
}

/**
 * Clean WordPress shortcodes
 */
function cleanShortcodes(content: string): string {
  // Remove WordPress shortcodes like [shortcode]content[/shortcode]
  // This is a basic implementation - may need enhancement
  let cleaned = content;
  
  // Remove self-closing shortcodes
  cleaned = cleaned.replace(/\[[\w-]+\s*\/\]/g, '');
  
  // Remove shortcode pairs but keep content
  cleaned = cleaned.replace(/\[[\w-]+[^\]]*\](.*?)\[\/[\w-]+\]/gs, '$1');
  
  // Remove remaining unclosed shortcodes
  cleaned = cleaned.replace(/\[[\w-]+[^\]]*\]/g, '');

  return cleaned;
}

/**
 * Process SEO data from Yoast
 */
function processSEOData(wpPage: any): any {
  const yoastData = wpPage.yoast_head_json || {};

  return {
    title: yoastData.title || wpPage.title?.rendered || '',
    description: yoastData.description || wpPage.excerpt?.rendered || '',
    canonical: yoastData.canonical || wpPage.link || '',
    robots: {
      index: yoastData.robots?.index || 'index',
      follow: yoastData.robots?.follow || 'follow',
    },
    openGraph: {
      type: yoastData.og_type || 'website',
      title: yoastData.og_title || yoastData.title || '',
      description: yoastData.og_description || yoastData.description || '',
      url: yoastData.og_url || wpPage.link || '',
      siteName: yoastData.og_site_name || 'Travel eSIM BG',
      images: yoastData.og_image ? [{
        url: yoastData.og_image[0]?.url || '',
        width: yoastData.og_image[0]?.width || 0,
        height: yoastData.og_image[0]?.height || 0,
        type: yoastData.og_image[0]?.type || '',
      }] : [],
      locale: yoastData.og_locale || 'en_GB',
      modifiedTime: yoastData.article_modified_time || '',
    },
    twitter: {
      card: yoastData.twitter_card || 'summary_large_image',
      misc: yoastData.twitter_misc || {},
    },
    schema: yoastData.schema || null,
  };
}

/**
 * Transform a single page
 */
function transformPage(wpPage: any, mediaMapping: { [key: string]: string }): ProcessedPage {
  let content = wpPage.content?.rendered || '';
  let excerpt = wpPage.excerpt?.rendered || '';

  // Transform URLs
  content = transformImageUrls(content, mediaMapping);
  content = transformInternalLinks(content);
  content = cleanShortcodes(content);

  excerpt = transformImageUrls(excerpt, mediaMapping);
  excerpt = cleanShortcodes(excerpt);

  return {
    slug: wpPage.slug,
    title: wpPage.title?.rendered || 'Untitled',
    content,
    excerpt,
    seo: processSEOData(wpPage),
    url: wpPage.link || '',
    modifiedDate: wpPage.modified || '',
    publishedDate: wpPage.date || '',
  };
}

/**
 * Transform a single post
 */
function transformPost(
  wpPost: any,
  mediaMapping: { [key: string]: string },
  categories: any[],
  tags: any[]
): ProcessedPost {
  const basePage = transformPage(wpPost, mediaMapping);

  // Get category names
  const postCategories = (wpPost.categories || [])
    .map((catId: number) => {
      const cat = categories.find(c => c.id === catId);
      return cat?.name || '';
    })
    .filter(Boolean);

  // Get tag names
  const postTags = (wpPost.tags || [])
    .map((tagId: number) => {
      const tag = tags.find(t => t.id === tagId);
      return tag?.name || '';
    })
    .filter(Boolean);

  return {
    ...basePage,
    author: wpPost._embedded?.author?.[0]?.name || 'Anonymous',
    categories: postCategories,
    tags: postTags,
  };
}

/**
 * Transform all pages
 */
function transformPages(mediaMapping: { [key: string]: string }): ProcessedPage[] {
  const pagesPath = path.join(RAW_DIR, 'pages.json');
  
  if (!fs.existsSync(pagesPath)) {
    console.log('⚠ No pages data found');
    return [];
  }

  const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
  console.log(`\nTransforming ${pages.length} pages...`);

  const transformed: ProcessedPage[] = [];
  const outputDir = path.join(PROCESSED_DIR, 'pages');
  ensureDirectoryExists(outputDir);

  for (const wpPage of pages) {
    const processed = transformPage(wpPage, mediaMapping);
    transformed.push(processed);

    // Save individual page file
    const filename = `${processed.slug || 'home'}.json`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(processed, null, 2), 'utf-8');
    console.log(`  ✓ ${filename}`);
  }

  return transformed;
}

/**
 * Transform all posts
 */
function transformPosts(mediaMapping: { [key: string]: string }): ProcessedPost[] {
  const postsPath = path.join(RAW_DIR, 'posts.json');
  const categoriesPath = path.join(RAW_DIR, 'categories.json');
  const tagsPath = path.join(RAW_DIR, 'tags.json');

  if (!fs.existsSync(postsPath)) {
    console.log('⚠ No posts data found');
    return [];
  }

  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  const categories = fs.existsSync(categoriesPath) 
    ? JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))
    : [];
  const tags = fs.existsSync(tagsPath)
    ? JSON.parse(fs.readFileSync(tagsPath, 'utf-8'))
    : [];

  console.log(`\nTransforming ${posts.length} posts...`);

  const transformed: ProcessedPost[] = [];
  const outputDir = path.join(PROCESSED_DIR, 'posts');
  ensureDirectoryExists(outputDir);

  for (const wpPost of posts) {
    const processed = transformPost(wpPost, mediaMapping, categories, tags);
    transformed.push(processed);

    // Save individual post file
    const filename = `${processed.slug}.json`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(processed, null, 2), 'utf-8');
    console.log(`  ✓ ${filename}`);
  }

  return transformed;
}

/**
 * Create index files for easy access
 */
function createIndexFiles(pages: ProcessedPage[], posts: ProcessedPost[]): void {
  // Pages index
  const pagesIndex = pages.map(p => ({
    slug: p.slug,
    title: p.title,
    url: p.url,
  }));
  fs.writeFileSync(
    path.join(PROCESSED_DIR, 'pages-index.json'),
    JSON.stringify(pagesIndex, null, 2),
    'utf-8'
  );

  // Posts index
  const postsIndex = posts.map(p => ({
    slug: p.slug,
    title: p.title,
    url: p.url,
    publishedDate: p.publishedDate,
    categories: p.categories,
  }));
  fs.writeFileSync(
    path.join(PROCESSED_DIR, 'posts-index.json'),
    JSON.stringify(postsIndex, null, 2),
    'utf-8'
  );

  console.log('\n✓ Index files created');
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Content Transformation Script');
  console.log('='.repeat(60));
  console.log(`Source: ${RAW_DIR}`);
  console.log(`Target: ${PROCESSED_DIR}`);

  try {
    // Ensure processed directory exists
    ensureDirectoryExists(PROCESSED_DIR);

    // Load media mapping
    console.log('\nLoading media mapping...');
    const mediaMapping = loadMediaMapping();
    console.log(`✓ Loaded ${Object.keys(mediaMapping).length} media URL mappings`);

    // Transform pages
    const pages = transformPages(mediaMapping);

    // Transform posts
    const posts = transformPosts(mediaMapping);

    // Create index files
    createIndexFiles(pages, posts);

    console.log('\n' + '='.repeat(60));
    console.log('✓ CONTENT TRANSFORMATION COMPLETED');
    console.log('='.repeat(60));
    console.log(`\nPages transformed: ${pages.length}`);
    console.log(`Posts transformed: ${posts.length}`);
    console.log(`\nProcessed data saved to: ${PROCESSED_DIR}`);

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { transformPage, transformPost, processSEOData };



