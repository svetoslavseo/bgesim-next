import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

interface PostData {
  slug: string;
  title: string;
  seo: {
    openGraph: {
      images: Array<{
        url: string;
        width?: number;
        height?: number;
        type?: string;
      }>;
    };
  };
}

const POSTS_DIR = path.join(process.cwd(), 'data', 'processed', 'posts');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'media', 'blog-featured');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Download an image from a URL
 */
async function downloadImage(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const file = fs.createWriteStream(outputPath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        file.close();
        fs.unlink(outputPath, () => {}); // Delete the file
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(outputPath, () => {}); // Delete the file
      reject(err);
    });
  });
}

/**
 * Get file extension from URL
 */
function getFileExtension(url: string): string {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname);
  return ext || '.png';
}

/**
 * Process all blog posts and download featured images
 */
async function downloadFeaturedImages() {
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.json'));
  
  console.log(`Found ${files.length} blog posts`);
  
  const imageMap: Record<string, string> = {};
  
  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const post: PostData = JSON.parse(content);
    
    if (post.seo?.openGraph?.images && post.seo.openGraph.images.length > 0) {
      const featuredImage = post.seo.openGraph.images[0];
      if (!featuredImage) continue;
      
      const imageUrl = featuredImage.url;
      
      console.log(`\nProcessing: ${post.slug}`);
      console.log(`Image URL: ${imageUrl}`);
      
      // Extract filename from URL or use slug
      const ext = getFileExtension(imageUrl);
      const filename = `${post.slug}${ext}`;
      const outputPath = path.join(OUTPUT_DIR, filename);
      
      // Check if image already exists
      if (fs.existsSync(outputPath)) {
        console.log(`✓ Image already exists: ${filename}`);
      } else {
        try {
          await downloadImage(imageUrl, outputPath);
          console.log(`✓ Downloaded: ${filename}`);
        } catch (error) {
          console.error(`✗ Failed to download: ${error}`);
          continue;
        }
      }
      
      // Map slug to local image path
      imageMap[post.slug] = `/media/blog-featured/${filename}`;
    } else {
      console.log(`\n✗ No featured image for: ${post.slug}`);
    }
  }
  
  // Save the image mapping
  const mappingPath = path.join(process.cwd(), 'data', 'processed', 'blog-featured-images.json');
  fs.writeFileSync(mappingPath, JSON.stringify(imageMap, null, 2));
  console.log(`\n✓ Image mapping saved to: ${mappingPath}`);
  
  console.log('\n=== Download Summary ===');
  console.log(`Total posts processed: ${files.length}`);
  console.log(`Featured images downloaded: ${Object.keys(imageMap).length}`);
}

// Run the script
downloadFeaturedImages()
  .then(() => {
    console.log('\n✓ All featured images downloaded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Error downloading featured images:', error);
    process.exit(1);
  });

