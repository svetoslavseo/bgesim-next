/**
 * WordPress REST API Data Extraction Script
 * Fetches all pages, posts, media, categories, and tags from WordPress REST API
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const WORDPRESS_BASE_URL = 'https://travelesim.bg';
const DATA_DIR = path.join(process.cwd(), 'data', 'raw');

interface WPResponse {
  data: any[];
  totalPages: number;
  total: number;
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
 * Fetch data from WordPress REST API with pagination support
 */
async function fetchFromWP(endpoint: string, perPage: number = 100): Promise<any[]> {
  const allData: any[] = [];
  let page = 1;
  let totalPages = 1;

  console.log(`\nFetching ${endpoint}...`);

  while (page <= totalPages) {
    const url = `${WORDPRESS_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=${perPage}&page=${page}&_embed`;
    
    console.log(`  Page ${page}/${totalPages}: ${url}`);

    try {
      const response = await makeRequest(url);
      const data = JSON.parse(response.body);
      
      // Get total pages from headers
      if (page === 1 && response.headers['x-wp-totalpages']) {
        totalPages = parseInt(response.headers['x-wp-totalpages'], 10);
        console.log(`  Total pages to fetch: ${totalPages}`);
      }

      if (Array.isArray(data)) {
        allData.push(...data);
        console.log(`  Fetched ${data.length} items (Total so far: ${allData.length})`);
      } else {
        allData.push(data);
      }

      page++;
    } catch (error: any) {
      if (error.statusCode === 400 && page > 1) {
        // No more pages
        console.log(`  Reached end of pagination at page ${page}`);
        break;
      }
      console.error(`  Error fetching page ${page}:`, error.message);
      break;
    }
  }

  console.log(`✓ Completed: ${allData.length} items fetched from ${endpoint}`);
  return allData;
}

/**
 * Make HTTP/HTTPS request
 */
function makeRequest(url: string): Promise<{ body: string; headers: any; statusCode: number }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'WordPress-NextJS-Migration-Script/1.0'
      }
    };

    const req = protocol.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ 
            body, 
            headers: res.headers,
            statusCode: res.statusCode 
          });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Fetch site information
 */
async function fetchSiteInfo(): Promise<any> {
  console.log('\nFetching site information...');
  try {
    const response = await makeRequest(`${WORDPRESS_BASE_URL}/wp-json`);
    const siteInfo = JSON.parse(response.body);
    console.log('✓ Site info fetched');
    return siteInfo;
  } catch (error: any) {
    console.error('Error fetching site info:', error.message);
    return {};
  }
}

/**
 * Save data to JSON file
 */
function saveToFile(filename: string, data: any): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ Saved to ${filePath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('WordPress Data Extraction Script');
  console.log('='.repeat(60));
  console.log(`Source: ${WORDPRESS_BASE_URL}`);
  console.log(`Target: ${DATA_DIR}`);
  
  // Ensure data directory exists
  ensureDirectoryExists(DATA_DIR);

  try {
    // Fetch site information
    const siteInfo = await fetchSiteInfo();
    saveToFile('site-info.json', siteInfo);

    // Fetch pages
    const pages = await fetchFromWP('/wp-json/wp/v2/pages');
    saveToFile('pages.json', pages);

    // Fetch posts
    const posts = await fetchFromWP('/wp-json/wp/v2/posts');
    saveToFile('posts.json', posts);

    // Fetch media
    const media = await fetchFromWP('/wp-json/wp/v2/media');
    saveToFile('media.json', media);

    // Fetch categories
    const categories = await fetchFromWP('/wp-json/wp/v2/categories');
    saveToFile('categories.json', categories);

    // Fetch tags
    const tags = await fetchFromWP('/wp-json/wp/v2/tags');
    saveToFile('tags.json', tags);

    // Create summary
    const summary = {
      fetchedAt: new Date().toISOString(),
      source: WORDPRESS_BASE_URL,
      counts: {
        pages: pages.length,
        posts: posts.length,
        media: media.length,
        categories: categories.length,
        tags: tags.length,
      }
    };
    saveToFile('summary.json', summary);

    console.log('\n' + '='.repeat(60));
    console.log('✓ ALL DATA EXTRACTION COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log('\nSummary:');
    console.log(`  Pages: ${summary.counts.pages}`);
    console.log(`  Posts: ${summary.counts.posts}`);
    console.log(`  Media: ${summary.counts.media}`);
    console.log(`  Categories: ${summary.counts.categories}`);
    console.log(`  Tags: ${summary.counts.tags}`);
    console.log(`\nData saved to: ${DATA_DIR}`);

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { fetchFromWP, fetchSiteInfo };



