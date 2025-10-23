import fs from 'fs';
import path from 'path';

interface BlogPost {
  slug: string;
  title: string;
  publishedDate: string;
  modifiedDate: string;
  author: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  url: string;
  seo: {
    title: string;
    description: string;
    openGraph: {
      title: string;
      description: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    };
    schema: {
      '@context': string;
      '@type': string;
      '@graph': Array<any>;
    };
  };
}

interface BlogPostData {
  [key: string]: BlogPost;
}

// Blog post URLs from the live site
const blogPostUrls = [
  'https://travelesim.bg/blog/kak-da-proverq-dali-imam-rouming/',
  'https://travelesim.bg/blog/kak-da-izbegnesh-skup-rouming-vav-velikobritaniya-s-esim-2025/',
  'https://travelesim.bg/blog/rouming-v-sarbiya-palno-rukovodstvo-za-putuvashti/',
  'https://travelesim.bg/blog/kakvo-e-esim/',
  'https://travelesim.bg/blog/kak-da-aktiviram-esim/',
  'https://travelesim.bg/blog/kak-da-proverq-dali-moyat-telefon-poddyrja-esim/',
  'https://travelesim.bg/blog/kak-da-izberq-nay-dobrata-esim-karta-za-putuvane/',
  'https://travelesim.bg/blog/kak-da-izbegnesh-skup-rouming-vav-velikobritaniya-s-esim-2025/',
  'https://travelesim.bg/blog/rouming-v-sarbiya-palno-rukovodstvo-za-putuvashti/',
  'https://travelesim.bg/blog/kakvo-e-esim/',
  'https://travelesim.bg/blog/kak-da-aktiviram-esim/',
  'https://travelesim.bg/blog/kak-da-proverq-dali-moyat-telefon-poddyrja-esim/',
  'https://travelesim.bg/blog/kak-da-izberq-nay-dobrata-esim-karta-za-putuvane/'
];

async function fetchBlogPostData(url: string): Promise<{ publishedDate: string; modifiedDate: string } | null> {
  try {
    console.log(`Fetching data from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    
    // Extract dates from HTML content
    // Look for date patterns in the content
    const datePatterns = [
      /октомври\s+(\d+),\s+(\d{4})/gi,
      /август\s+(\d+),\s+(\d{4})/gi,
      /юли\s+(\d+),\s+(\d{4})/gi,
      /юни\s+(\d+),\s+(\d{4})/gi,
      /май\s+(\d+),\s+(\d{4})/gi,
      /април\s+(\d+),\s+(\d{4})/gi,
      /март\s+(\d+),\s+(\d{4})/gi,
      /февруари\s+(\d+),\s+(\d{4})/gi,
      /януари\s+(\d+),\s+(\d{4})/gi,
      /декември\s+(\d+),\s+(\d{4})/gi,
      /ноември\s+(\d+),\s+(\d{4})/gi,
      /септември\s+(\d+),\s+(\d{4})/gi
    ];
    
    const monthNames = {
      'януари': '01', 'февруари': '02', 'март': '03', 'април': '04',
      'май': '05', 'юни': '06', 'юли': '07', 'август': '08',
      'септември': '09', 'октомври': '10', 'ноември': '11', 'декември': '12'
    };
    
    let publishedDate = '';
    let modifiedDate = '';
    
    // Look for "Актуализирано" (Updated) date
    const updatedMatch = html.match(/Актуализирано\s*:\s*([^<]+)/i);
    if (updatedMatch && updatedMatch[1]) {
      const dateStr = updatedMatch[1].trim();
      console.log(`Found updated date: ${dateStr}`);
      
      // Parse Bulgarian date format
      for (const pattern of datePatterns) {
        const match = dateStr.match(pattern);
        if (match && match[0] && match[1] && match[2]) {
          const monthName = match[0]!.split(' ')[0]!.toLowerCase();
          const day = match[1]!;
          const year = match[2]!;
          const month = monthNames[monthName as keyof typeof monthNames];
          
          if (month) {
            modifiedDate = `${year}-${month}-${day.padStart(2, '0')}T00:00:00+00:00`;
            break;
          }
        }
      }
    }
    
    // Look for "Публикувано" (Published) date or general date patterns
    const publishedMatch = html.match(/Публикувано\s*:\s*([^<]+)/i) || 
                          html.match(/(\d{1,2}\s+(?:януари|февруари|март|април|май|юни|юли|август|септември|октомври|ноември|декември)\s+\d{4})/i);
    
    if (publishedMatch) {
      const dateStr = (publishedMatch[1] || publishedMatch[0]) ?? '';
      console.log(`Found published date: ${dateStr}`);
      
      // Parse Bulgarian date format
      for (const pattern of datePatterns) {
        const match = dateStr.match(pattern);
        if (match && match[0] && match[1] && match[2]) {
          const monthName = match[0]!.split(' ')[0]!.toLowerCase();
          const day = match[1]!;
          const year = match[2]!;
          const month = monthNames[monthName as keyof typeof monthNames];
          
          if (month) {
            publishedDate = `${year}-${month}-${day.padStart(2, '0')}T00:00:00+00:00`;
            break;
          }
        }
      }
    }
    
    // If no specific dates found, try to extract from meta tags or other sources
    if (!publishedDate && !modifiedDate) {
      // Look for date in meta tags
      const metaDateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i);
      if (metaDateMatch && metaDateMatch[1]) {
        publishedDate = metaDateMatch[1];
        modifiedDate = publishedDate;
      }
    }
    
    if (!publishedDate && !modifiedDate) {
      console.error(`No dates found in ${url}`);
      return null;
    }
    
    // Use published date as modified date if no modified date found
    if (!modifiedDate) {
      modifiedDate = publishedDate;
    }
    
    console.log(`✅ Found dates for ${url}:`);
    console.log(`   Published: ${publishedDate}`);
    console.log(`   Modified: ${modifiedDate}`);
    
    return {
      publishedDate: publishedDate || modifiedDate,
      modifiedDate: modifiedDate || publishedDate
    };
    
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function updateBlogDates() {
  console.log('🚀 Starting blog dates update process...');
  
  // Read blog posts from individual files
  const postsDir = path.join(process.cwd(), 'data', 'processed', 'posts');
  
  if (!fs.existsSync(postsDir)) {
    console.error('❌ Blog posts directory not found:', postsDir);
    return;
  }
  
  const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
  console.log(`📚 Found ${postFiles.length} blog posts in data`);
  
  const updatedPosts: string[] = [];
  const failedPosts: string[] = [];
  
  // Process each blog post
  for (const filename of postFiles) {
    const slug = filename.replace('.json', '');
    const postPath = path.join(postsDir, filename);
    const post: BlogPost = JSON.parse(fs.readFileSync(postPath, 'utf8'));
    try {
      // Construct URL
      const url = `https://travelesim.bg/blog/${slug}/`;
      
      console.log(`\n📝 Processing: ${post.title}`);
      console.log(`🔗 URL: ${url}`);
      
      // Fetch accurate dates from live site
      const dates = await fetchBlogPostData(url);
      
      if (dates) {
        // Update the post with accurate dates
        const originalPublished = post.publishedDate;
        const originalModified = post.modifiedDate;
        
        post.publishedDate = dates.publishedDate;
        post.modifiedDate = dates.modifiedDate;
        
        // Update SEO schema dates as well
        if (post.seo.schema['@graph']) {
          const blogPosting = post.seo.schema['@graph'].find((item: any) => item['@type'] === 'BlogPosting');
          if (blogPosting) {
            blogPosting.datePublished = dates.publishedDate;
            blogPosting.dateModified = dates.modifiedDate;
          }
        }
        
        // Save updated post
        fs.writeFileSync(postPath, JSON.stringify(post, null, 2));
        
        updatedPosts.push(slug);
        
        console.log(`✅ Updated ${slug}:`);
        console.log(`   Published: ${originalPublished} → ${dates.publishedDate}`);
        console.log(`   Modified: ${originalModified} → ${dates.modifiedDate}`);
        
      } else {
        failedPosts.push(slug);
        console.log(`❌ Failed to get dates for ${slug}`);
      }
      
      // Add delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error processing ${slug}:`, error);
      failedPosts.push(slug);
    }
  }
  
  // Summary
  if (updatedPosts.length > 0) {
    console.log(`\n💾 Successfully updated ${updatedPosts.length} posts!`);
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully updated: ${updatedPosts.length} posts`);
  console.log(`❌ Failed to update: ${failedPosts.length} posts`);
  
  if (updatedPosts.length > 0) {
    console.log('\n🎉 Updated posts:');
    updatedPosts.forEach(slug => console.log(`   - ${slug}`));
  }
  
  if (failedPosts.length > 0) {
    console.log('\n⚠️  Failed posts:');
    failedPosts.forEach(slug => console.log(`   - ${slug}`));
  }
}

// Run the update process
updateBlogDates().catch(console.error);
