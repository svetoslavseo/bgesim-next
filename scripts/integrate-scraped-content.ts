/**
 * Integrate Scraped HTML Content
 * Takes scraped HTML files and integrates them into processed page data
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROCESSED_DIR = path.join(DATA_DIR, 'processed');
const SCRAPED_HTML_DIR = path.join(DATA_DIR, 'scraped-html');

/**
 * Integrate scraped HTML into pages
 */
function integratePages(): number {
  const pagesDir = path.join(PROCESSED_DIR, 'pages');
  const scrapedPagesDir = path.join(SCRAPED_HTML_DIR, 'pages');
  
  if (!fs.existsSync(scrapedPagesDir)) {
    console.log('⚠ No scraped pages found');
    return 0;
  }
  
  const htmlFiles = fs.readdirSync(scrapedPagesDir).filter(f => f.endsWith('.html'));
  let updated = 0;
  
  console.log(`\nIntegrating ${htmlFiles.length} scraped pages...\n`);
  
  for (const htmlFile of htmlFiles) {
    const slug = path.basename(htmlFile, '.html');
    const jsonPath = path.join(pagesDir, `${slug}.json`);
    const htmlPath = path.join(scrapedPagesDir, htmlFile);
    
    if (!fs.existsSync(jsonPath)) {
      console.log(`  ⊘ Skipped: ${slug} (no JSON file found)`);
      continue;
    }
    
    try {
      // Read existing page data
      const pageData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      
      // Read scraped HTML
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      // Skip if placeholder
      if (html.includes('TODO: Replace this')) {
        console.log(`  ⊘ Skipped: ${slug} (placeholder)`);
        continue;
      }
      
      // Update content
      pageData.content = html;
      
      // Save updated data
      fs.writeFileSync(jsonPath, JSON.stringify(pageData, null, 2), 'utf-8');
      console.log(`  ✓ ${slug}`);
      updated++;
      
    } catch (error: any) {
      console.log(`  ✗ Failed: ${slug} - ${error.message}`);
    }
  }
  
  return updated;
}

/**
 * Integrate scraped HTML into posts
 */
function integratePosts(): number {
  const postsDir = path.join(PROCESSED_DIR, 'posts');
  const scrapedPostsDir = path.join(SCRAPED_HTML_DIR, 'posts');
  
  if (!fs.existsSync(scrapedPostsDir)) {
    console.log('⚠ No scraped posts found');
    return 0;
  }
  
  const htmlFiles = fs.readdirSync(scrapedPostsDir).filter(f => f.endsWith('.html'));
  let updated = 0;
  
  console.log(`\nIntegrating ${htmlFiles.length} scraped posts...\n`);
  
  for (const htmlFile of htmlFiles) {
    const slug = path.basename(htmlFile, '.html');
    const jsonPath = path.join(postsDir, `${slug}.json`);
    const htmlPath = path.join(scrapedPostsDir, htmlFile);
    
    if (!fs.existsSync(jsonPath)) {
      console.log(`  ⊘ Skipped: ${slug} (no JSON file found)`);
      continue;
    }
    
    try {
      // Read existing post data
      const postData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      
      // Read scraped HTML
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      // Skip if placeholder
      if (html.includes('TODO: Replace this')) {
        console.log(`  ⊘ Skipped: ${slug} (placeholder)`);
        continue;
      }
      
      // Update content
      postData.content = html;
      
      // Save updated data
      fs.writeFileSync(jsonPath, JSON.stringify(postData, null, 2), 'utf-8');
      console.log(`  ✓ ${slug}`);
      updated++;
      
    } catch (error: any) {
      console.log(`  ✗ Failed: ${slug} - ${error.message}`);
    }
  }
  
  return updated;
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Integrate Scraped HTML Content');
  console.log('='.repeat(60));
  
  try {
    const pagesUpdated = integratePages();
    const postsUpdated = integratePosts();
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ INTEGRATION COMPLETED');
    console.log('='.repeat(60));
    console.log(`\nPages updated: ${pagesUpdated}`);
    console.log(`Posts updated: ${postsUpdated}`);
    console.log(`Total: ${pagesUpdated + postsUpdated}`);
    
    if (pagesUpdated === 0 && postsUpdated === 0) {
      console.log('\n⚠ No content was integrated.');
      console.log('Make sure you have scraped HTML files in data/scraped-html/');
    } else {
      console.log('\n✓ Content successfully integrated!');
      console.log('Restart your dev server to see the changes: npm run dev\n');
    }
    
  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { integratePages, integratePosts };


