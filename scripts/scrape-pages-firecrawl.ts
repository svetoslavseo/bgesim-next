/**
 * Firecrawl Page Scraping Script
 * Uses Firecrawl MCP to scrape rendered pages and extract HTML structure and CSS
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCRAPED_DIR = path.join(DATA_DIR, 'scraped');
const RAW_DIR = path.join(DATA_DIR, 'raw');

interface PageData {
  url: string;
  slug: string;
  title: string;
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
 * Load pages from WordPress data
 */
function loadPages(): PageData[] {
  const pagesPath = path.join(RAW_DIR, 'pages.json');
  
  if (!fs.existsSync(pagesPath)) {
    throw new Error(`Pages data not found at ${pagesPath}. Run fetch-wordpress-data.ts first.`);
  }

  const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
  
  return pagesData.map((page: any) => ({
    url: page.link,
    slug: page.slug || 'home',
    title: page.title?.rendered || 'Untitled'
  }));
}

/**
 * Load posts from WordPress data
 */
function loadPosts(): PageData[] {
  const postsPath = path.join(RAW_DIR, 'posts.json');
  
  if (!fs.existsSync(postsPath)) {
    console.log('No posts data found, skipping posts.');
    return [];
  }

  const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  
  return postsData.map((post: any) => ({
    url: post.link,
    slug: post.slug,
    title: post.title?.rendered || 'Untitled'
  }));
}

/**
 * Instructions for using Firecrawl MCP
 */
function printInstructions(pages: PageData[], posts: PageData[]): void {
  console.log('='.repeat(60));
  console.log('Firecrawl Scraping Instructions');
  console.log('='.repeat(60));
  console.log('\nThis script requires manual use of Firecrawl MCP server.');
  console.log('You need to use the Chrome DevTools MCP to scrape each page.\n');
  
  console.log('For each URL below, you need to:');
  console.log('1. Open the URL in Chrome using chrome-devtools MCP');
  console.log('2. Take a snapshot using mcp_chrome-devtools_take_snapshot');
  console.log('3. Extract computed CSS using Chrome DevTools');
  console.log('4. Save the data to the appropriate file\n');

  console.log('PAGES TO SCRAPE:');
  console.log('-'.repeat(60));
  pages.forEach((page, index) => {
    console.log(`${index + 1}. ${page.title}`);
    console.log(`   URL: ${page.url}`);
    console.log(`   Save to: data/scraped/pages/${page.slug}.json\n`);
  });

  if (posts.length > 0) {
    console.log('\nPOSTS TO SCRAPE:');
    console.log('-'.repeat(60));
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   URL: ${post.url}`);
      console.log(`   Save to: data/scraped/posts/${post.slug}.json\n`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('SCRAPING CHECKLIST');
  console.log('='.repeat(60));
  console.log('For each page, capture:');
  console.log('  □ Full HTML structure');
  console.log('  □ All CSS classes used');
  console.log('  □ Computed styles for each component');
  console.log('  □ Responsive breakpoints');
  console.log('  □ Images and their dimensions');
  console.log('  □ Any custom fonts');
  console.log('  □ Navigation structure');
  console.log('  □ Footer content\n');
}

/**
 * Create template files for scraped data
 */
function createTemplates(pages: PageData[], posts: PageData[]): void {
  console.log('Creating directory structure and template files...\n');

  // Create directories
  ensureDirectoryExists(path.join(SCRAPED_DIR, 'pages'));
  ensureDirectoryExists(path.join(SCRAPED_DIR, 'posts'));
  ensureDirectoryExists(path.join(SCRAPED_DIR, 'css'));

  // Create a template structure
  const template = {
    scraped_at: null,
    url: '',
    slug: '',
    title: '',
    html_structure: {
      header: {},
      main_content: {},
      footer: {},
    },
    css_classes: [],
    computed_styles: {},
    responsive_breakpoints: {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1280px'
    },
    fonts: [],
    images: [],
    notes: 'Manual scraping required. Use Chrome DevTools MCP to capture data.'
  };

  // Create template for each page
  pages.forEach(page => {
    const filePath = path.join(SCRAPED_DIR, 'pages', `${page.slug}.json`);
    if (!fs.existsSync(filePath)) {
      const pageTemplate = {
        ...template,
        url: page.url,
        slug: page.slug,
        title: page.title
      };
      fs.writeFileSync(filePath, JSON.stringify(pageTemplate, null, 2), 'utf-8');
      console.log(`✓ Created template: ${filePath}`);
    }
  });

  // Create template for each post
  posts.forEach(post => {
    const filePath = path.join(SCRAPED_DIR, 'posts', `${post.slug}.json`);
    if (!fs.existsSync(filePath)) {
      const postTemplate = {
        ...template,
        url: post.url,
        slug: post.slug,
        title: post.title
      };
      fs.writeFileSync(filePath, JSON.stringify(postTemplate, null, 2), 'utf-8');
      console.log(`✓ Created template: ${filePath}`);
    }
  });

  // Create CSS extraction template
  const cssTemplate = {
    extraction_date: null,
    global_styles: {
      variables: {},
      reset: '',
      base: ''
    },
    component_styles: {},
    oxygen_builder_classes: {},
    notes: 'Extract CSS using Chrome DevTools computed styles panel'
  };
  
  const cssFilePath = path.join(SCRAPED_DIR, 'css', 'extracted-styles.json');
  if (!fs.existsSync(cssFilePath)) {
    fs.writeFileSync(cssFilePath, JSON.stringify(cssTemplate, null, 2), 'utf-8');
    console.log(`✓ Created CSS template: ${cssFilePath}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Firecrawl Page Scraping Script');
  console.log('='.repeat(60));
  console.log(`Target: ${SCRAPED_DIR}\n`);

  try {
    // Load pages and posts
    const pages = loadPages();
    const posts = loadPosts();

    console.log(`Found ${pages.length} pages and ${posts.length} posts to scrape.\n`);

    // Create directory structure and templates
    createTemplates(pages, posts);

    // Print instructions
    printInstructions(pages, posts);

    console.log('NOTE: This is a helper script that prepares the structure.');
    console.log('You must manually scrape each page using Chrome DevTools MCP.\n');
    console.log('Next steps:');
    console.log('1. Use the Chrome DevTools MCP to visit each URL');
    console.log('2. Capture snapshots and extract CSS');
    console.log('3. Populate the template JSON files with scraped data');
    console.log('4. Run transform-content.ts once scraping is complete\n');

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



