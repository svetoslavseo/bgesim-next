/**
 * Media Download Script
 * Downloads all media assets from WordPress and creates URL mapping
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

const DATA_DIR = path.join(process.cwd(), 'data', 'raw');
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'media');
const MEDIA_JSON = path.join(DATA_DIR, 'media.json');

interface MediaItem {
  id: number;
  source_url: string;
  slug: string;
  title?: { rendered?: string };
  alt_text?: string;
  media_type?: string;
  mime_type?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: any;
  };
}

interface MediaMapping {
  [oldUrl: string]: string;
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
 * Download file from URL
 */
function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const file = fs.createWriteStream(outputPath);

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        fs.unlinkSync(outputPath);
        if (response.headers.location) {
          downloadFile(response.headers.location, outputPath)
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error('Redirect without location header'));
        }
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });

    file.on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

/**
 * Get safe filename from URL
 */
function getSafeFilename(url: string, slug: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = path.basename(pathname);
    
    // If filename is valid, use it
    if (filename && filename.includes('.')) {
      return filename;
    }
    
    // Otherwise, create from slug
    const ext = path.extname(pathname) || '.jpg';
    return `${slug}${ext}`;
  } catch {
    return `${slug}.jpg`;
  }
}

/**
 * Organize media by type
 */
function getMediaDirectory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('application/pdf')) return 'documents';
  return 'other';
}

/**
 * Download all media items
 */
async function downloadMedia(mediaItems: MediaItem[]): Promise<MediaMapping> {
  const mapping: MediaMapping = {};
  let successCount = 0;
  let failCount = 0;

  console.log(`\nDownloading ${mediaItems.length} media items...\n`);

  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    if (!item) continue;
    
    const progress = `[${i + 1}/${mediaItems.length}]`;

    try {
      // Determine media type and directory
      const mediaType = getMediaDirectory(item.mime_type || 'image/jpeg');
      const mediaDir = path.join(PUBLIC_DIR, mediaType);
      ensureDirectoryExists(mediaDir);

      // Get safe filename
      const filename = getSafeFilename(item.source_url, item.slug);
      const outputPath = path.join(mediaDir, filename);

      // Check if already downloaded
      if (fs.existsSync(outputPath)) {
        console.log(`${progress} ⊘ Skipped (exists): ${filename}`);
        mapping[item.source_url] = `/media/${mediaType}/${filename}`;
        successCount++;
        continue;
      }

      // Download the file
      console.log(`${progress} ↓ Downloading: ${filename}`);
      await downloadFile(item.source_url, outputPath);
      
      // Add to mapping
      mapping[item.source_url] = `/media/${mediaType}/${filename}`;
      
      console.log(`${progress} ✓ Downloaded: ${filename}`);
      successCount++;

      // Also download responsive sizes if available
      if (item.media_details?.sizes) {
        for (const [sizeName, sizeData] of Object.entries(item.media_details.sizes)) {
          const sizeInfo = sizeData as any;
          if (sizeInfo.source_url) {
            const sizeFilename = getSafeFilename(sizeInfo.source_url, `${item.slug}-${sizeName}`);
            const sizeOutputPath = path.join(mediaDir, sizeFilename);
            
            if (!fs.existsSync(sizeOutputPath)) {
              try {
                await downloadFile(sizeInfo.source_url, sizeOutputPath);
                mapping[sizeInfo.source_url] = `/media/${mediaType}/${sizeFilename}`;
              } catch (err) {
                // Silently skip size variants that fail
              }
            } else {
              mapping[sizeInfo.source_url] = `/media/${mediaType}/${sizeFilename}`;
            }
          }
        }
      }

    } catch (error: any) {
      console.log(`${progress} ✗ Failed: ${item.slug} - ${error.message}`);
      failCount++;
    }

    // Add small delay to avoid overwhelming the server
    if (i < mediaItems.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Download complete: ${successCount} succeeded, ${failCount} failed`);
  console.log(`${'='.repeat(60)}\n`);

  return mapping;
}

/**
 * Save media mapping
 */
function saveMapping(mapping: MediaMapping): void {
  const mappingPath = path.join(DATA_DIR, 'media-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`✓ Media mapping saved to: ${mappingPath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Media Download Script');
  console.log('='.repeat(60));
  console.log(`Source: ${MEDIA_JSON}`);
  console.log(`Target: ${PUBLIC_DIR}`);

  try {
    // Check if media.json exists
    if (!fs.existsSync(MEDIA_JSON)) {
      throw new Error(`Media data not found at ${MEDIA_JSON}. Run fetch-wordpress-data.ts first.`);
    }

    // Load media items
    const mediaItems: MediaItem[] = JSON.parse(fs.readFileSync(MEDIA_JSON, 'utf-8'));
    console.log(`\nFound ${mediaItems.length} media items to process.`);

    // Ensure public directory exists
    ensureDirectoryExists(PUBLIC_DIR);

    // Download all media
    const mapping = await downloadMedia(mediaItems);

    // Save mapping
    saveMapping(mapping);

    console.log('\n✓ ALL MEDIA DOWNLOADED SUCCESSFULLY');
    console.log(`\nTotal URLs mapped: ${Object.keys(mapping).length}`);

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { downloadMedia, saveMapping };



