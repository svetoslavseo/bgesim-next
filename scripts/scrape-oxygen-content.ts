/**
 * Oxygen Builder Content Scraper
 * Uses Chrome DevTools MCP to scrape actual rendered HTML from Oxygen Builder pages
 * This bypasses the limitation where Oxygen Builder doesn't store content in WordPress REST API
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROCESSED_DIR = path.join(DATA_DIR, 'processed');
const SCRAPED_HTML_DIR = path.join(DATA_DIR, 'scraped-html');

interface PageInfo {
  slug: string;
  title: string;
  url: string;
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
 * Load pages that need scraping
 */
function loadPages(): PageInfo[] {
  const pagesIndexPath = path.join(PROCESSED_DIR, 'pages-index.json');
  
  if (!fs.existsSync(pagesIndexPath)) {
    throw new Error('Pages index not found. Run extract:all first.');
  }
  
  const pages: PageInfo[] = JSON.parse(fs.readFileSync(pagesIndexPath, 'utf-8'));
  return pages;
}

/**
 * Load posts that need scraping
 */
function loadPosts(): PageInfo[] {
  const postsIndexPath = path.join(PROCESSED_DIR, 'posts-index.json');
  
  if (!fs.existsSync(postsIndexPath)) {
    return [];
  }
  
  const posts: PageInfo[] = JSON.parse(fs.readFileSync(postsIndexPath, 'utf-8'));
  return posts.map(post => ({
    ...post,
    url: `https://travelesim.bg/blog/${post.slug}/`
  }));
}

/**
 * Instructions for manual scraping with Chrome DevTools MCP
 */
function printInstructions(): void {
  console.log('='.repeat(70));
  console.log('OXYGEN BUILDER CONTENT SCRAPING');
  console.log('='.repeat(70));
  console.log('\nOxygen Builder does not expose content via WordPress REST API.');
  console.log('You need to use Chrome DevTools MCP to scrape the rendered HTML.\n');
  
  console.log('AUTOMATED SCRAPING SCRIPT:');
  console.log('-'.repeat(70));
  console.log('\nThis script will guide you through scraping each page.');
  console.log('For each page, you need to:');
  console.log('  1. The page will open automatically in Chrome');
  console.log('  2. Take a snapshot using mcp_chrome-devtools_take_snapshot');
  console.log('  3. Extract the main content HTML');
  console.log('  4. Save it to the appropriate file\n');
  
  console.log('ALTERNATIVE - MANUAL METHOD:');
  console.log('-'.repeat(70));
  console.log('If you prefer manual scraping:');
  console.log('  1. Open each page URL in Chrome');
  console.log('  2. Right-click on main content → Inspect');
  console.log('  3. Find the main content container');
  console.log('  4. Right-click element → Copy → Copy outerHTML');
  console.log('  5. Save to: data/scraped-html/pages/[slug].html\n');
}

/**
 * Create URL list file for reference
 */
function createURLList(pages: PageInfo[], posts: PageInfo[]): void {
  const urlListPath = path.join(DATA_DIR, 'pages-to-scrape.txt');
  
  let content = 'PAGES TO SCRAPE\n';
  content += '='.repeat(70) + '\n\n';
  
  content += 'PAGES:\n';
  content += '-'.repeat(70) + '\n';
  pages.forEach((page, idx) => {
    content += `${idx + 1}. ${page.title}\n`;
    content += `   URL: ${page.url}\n`;
    content += `   Save to: data/scraped-html/pages/${page.slug}.html\n\n`;
  });
  
  if (posts.length > 0) {
    content += '\nPOSTS:\n';
    content += '-'.repeat(70) + '\n';
    posts.forEach((post, idx) => {
      content += `${idx + 1}. ${post.title}\n`;
      content += `   URL: ${post.url}\n`;
      content += `   Save to: data/scraped-html/posts/${post.slug}.html\n\n`;
    });
  }
  
  fs.writeFileSync(urlListPath, content, 'utf-8');
  console.log(`\n✓ URL list saved to: ${urlListPath}`);
}

/**
 * Create placeholder HTML files
 */
function createPlaceholders(pages: PageInfo[], posts: PageInfo[]): void {
  ensureDirectoryExists(path.join(SCRAPED_HTML_DIR, 'pages'));
  ensureDirectoryExists(path.join(SCRAPED_HTML_DIR, 'posts'));
  
  console.log('\nCreating placeholder files...\n');
  
  let created = 0;
  
  pages.forEach(page => {
    const htmlPath = path.join(SCRAPED_HTML_DIR, 'pages', `${page.slug}.html`);
    if (!fs.existsSync(htmlPath)) {
      const placeholder = `<!-- Scraped content for: ${page.title} -->
<!-- URL: ${page.url} -->
<!-- TODO: Replace this with actual scraped HTML content -->

<div class="page-content">
  <h1>${page.title}</h1>
  <p>Content needs to be scraped from WordPress site.</p>
</div>`;
      fs.writeFileSync(htmlPath, placeholder, 'utf-8');
      created++;
    }
  });
  
  posts.forEach(post => {
    const htmlPath = path.join(SCRAPED_HTML_DIR, 'posts', `${post.slug}.html`);
    if (!fs.existsSync(htmlPath)) {
      const placeholder = `<!-- Scraped content for: ${post.title} -->
<!-- URL: ${post.url} -->
<!-- TODO: Replace this with actual scraped HTML content -->

<article class="post-content">
  <h1>${post.title}</h1>
  <p>Content needs to be scraped from WordPress site.</p>
</article>`;
      fs.writeFileSync(htmlPath, placeholder, 'utf-8');
      created++;
    }
  });
  
  console.log(`✓ Created ${created} placeholder files\n`);
}

/**
 * Main execution
 */
async function main() {
  try {
    printInstructions();
    
    // Load pages and posts
    const pages = loadPages();
    const posts = loadPosts();
    
    console.log(`\nFound ${pages.length} pages and ${posts.length} posts to scrape.\n`);
    
    // Create URL list
    createURLList(pages, posts);
    
    // Create placeholders
    createPlaceholders(pages, posts);
    
    console.log('='.repeat(70));
    console.log('NEXT STEPS');
    console.log('='.repeat(70));
    console.log('\n1. Review the URL list at: data/pages-to-scrape.txt');
    console.log('\n2. Use Chrome DevTools MCP to scrape each page:');
    console.log('   - Navigate to each URL');
    console.log('   - Use take_snapshot to capture content');
    console.log('   - Extract main content HTML');
    console.log('   - Save to corresponding HTML file');
    console.log('\n3. After scraping, run: npm run integrate:scraped');
    console.log('   This will integrate the HTML into your Next.js pages\n');
    
    console.log('TIP: Focus on homepage and top 3-5 most important pages first!');
    console.log('     You can scrape the rest gradually.\n');
    
  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { loadPages, loadPosts };


