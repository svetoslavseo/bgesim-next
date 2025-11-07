/**
 * Synchronize dateModified across JSON files, schema, and sitemap
 * 
 * This script ensures that:
 * 1. Root modifiedDate is the source of truth
 * 2. Schema dateModified matches root modifiedDate
 * 3. OpenGraph modifiedTime matches root modifiedDate
 * 4. All dates use consistent ISO 8601 format
 */

import fs from 'fs';
import path from 'path';

const PROCESSED_DIR = path.join(process.cwd(), 'data', 'processed');
const PAGES_DIR = path.join(PROCESSED_DIR, 'pages');
const POSTS_DIR = path.join(PROCESSED_DIR, 'posts');

interface ProcessedContent {
  slug: string;
  modifiedDate: string;
  publishedDate: string;
  seo: {
    openGraph?: {
      modifiedTime?: string;
    };
    schema?: {
      '@graph'?: Array<{
        '@type'?: string;
        dateModified?: string;
        datePublished?: string;
      }>;
      dateModified?: string;
      datePublished?: string;
    };
  };
  [key: string]: any;
}

/**
 * Normalize date to ISO 8601 format with timezone
 * Handles various input formats:
 * - "2025-11-01 21:49:49" -> "2025-11-01T21:49:49+00:00"
 * - "2025-11-01T21:49:49.159Z" -> "2025-11-01T21:49:49+00:00"
 * - "2025-11-01T21:49:49+00:00" -> "2025-11-01T21:49:49+00:00"
 */
function normalizeDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    // Handle space-separated format: "2025-11-01 21:49:49"
    if (dateString.includes(' ') && !dateString.includes('T')) {
      dateString = dateString.replace(' ', 'T');
    }
    
    // Parse the date
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return dateString;
    }
    
    // Format as ISO 8601 with timezone
    // Get the date components in UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
  } catch (error) {
    console.warn(`Error normalizing date ${dateString}:`, error);
    return dateString;
  }
}

/**
 * Update dateModified in schema
 */
function updateSchemaDates(schema: any, modifiedDate: string, publishedDate: string): any {
  if (!schema) return schema;
  
  const normalizedModified = normalizeDate(modifiedDate);
  const normalizedPublished = normalizeDate(publishedDate);
  
  // Handle @graph format (most common)
  if (schema['@graph'] && Array.isArray(schema['@graph'])) {
    schema['@graph'] = schema['@graph'].map((item: any) => {
      if (item['@type'] === 'Article' || item['@type'] === 'WebPage' || item['@type'] === 'BlogPosting') {
        if (item.dateModified) {
          item.dateModified = normalizedModified;
        }
        if (item.datePublished) {
          item.datePublished = normalizedPublished;
        }
      }
      return item;
    });
  }
  
  // Handle direct dateModified/datePublished
  if (schema.dateModified) {
    schema.dateModified = normalizedModified;
  }
  if (schema.datePublished) {
    schema.datePublished = normalizedPublished;
  }
  
  return schema;
}

/**
 * Update OpenGraph modifiedTime
 */
function updateOpenGraphDates(openGraph: any, modifiedDate: string): any {
  if (!openGraph) return openGraph;
  
  const normalizedModified = normalizeDate(modifiedDate);
  
  if (openGraph.modifiedTime !== undefined) {
    openGraph.modifiedTime = normalizedModified;
  }
  
  return openGraph;
}

/**
 * Process a single JSON file
 */
function processFile(filePath: string, type: 'page' | 'post'): { updated: boolean; errors: string[] } {
  const errors: string[] = [];
  let updated = false;
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: ProcessedContent = JSON.parse(content);
    
    // Normalize root modifiedDate (source of truth)
    const originalModifiedDate = data.modifiedDate;
    const normalizedModifiedDate = normalizeDate(originalModifiedDate);
    
    if (originalModifiedDate !== normalizedModifiedDate) {
      data.modifiedDate = normalizedModifiedDate;
      updated = true;
    }
    
    // Normalize publishedDate
    const originalPublishedDate = data.publishedDate;
    const normalizedPublishedDate = normalizeDate(originalPublishedDate);
    
    if (originalPublishedDate !== normalizedPublishedDate) {
      data.publishedDate = normalizedPublishedDate;
      updated = true;
    }
    
    // Update schema dates
    if (data.seo?.schema) {
      const originalSchema = JSON.stringify(data.seo.schema);
      data.seo.schema = updateSchemaDates(
        data.seo.schema,
        normalizedModifiedDate,
        normalizedPublishedDate
      );
      
      if (JSON.stringify(data.seo.schema) !== originalSchema) {
        updated = true;
      }
    }
    
    // Update OpenGraph dates
    if (data.seo?.openGraph) {
      const originalOpenGraph = JSON.stringify(data.seo.openGraph);
      data.seo.openGraph = updateOpenGraphDates(
        data.seo.openGraph,
        normalizedModifiedDate
      );
      
      if (JSON.stringify(data.seo.openGraph) !== originalOpenGraph) {
        updated = true;
      }
    }
    
    // Save if updated
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    
    return { updated, errors };
  } catch (error: any) {
    errors.push(`Error processing ${filePath}: ${error.message}`);
    return { updated: false, errors };
  }
}

/**
 * Process all files in a directory
 */
function processDirectory(dirPath: string, type: 'page' | 'post'): {
  processed: number;
  updated: number;
  errors: string[];
} {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory does not exist: ${dirPath}`);
    return { processed: 0, updated: 0, errors: [] };
  }
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  let processed = 0;
  let updated = 0;
  const allErrors: string[] = [];
  
  console.log(`\nProcessing ${type}s in ${dirPath}...`);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const result = processFile(filePath, type);
    
    processed++;
    if (result.updated) {
      updated++;
      console.log(`  ✓ Updated: ${file}`);
    } else if (result.errors.length > 0) {
      console.log(`  ✗ Error: ${file}`);
      allErrors.push(...result.errors);
    } else {
      console.log(`  - No changes: ${file}`);
    }
  }
  
  return { processed, updated, errors: allErrors };
}

/**
 * Main function
 */
function main() {
  console.log('='.repeat(60));
  console.log('Date Synchronization Script');
  console.log('='.repeat(60));
  console.log('This script synchronizes modifiedDate across:');
  console.log('  - Root modifiedDate (source of truth)');
  console.log('  - Schema dateModified');
  console.log('  - OpenGraph modifiedTime');
  console.log('  - All dates normalized to ISO 8601 format');
  console.log('='.repeat(60));
  
  const pagesResult = processDirectory(PAGES_DIR, 'page');
  const postsResult = processDirectory(POSTS_DIR, 'post');
  
  const totalProcessed = pagesResult.processed + postsResult.processed;
  const totalUpdated = pagesResult.updated + postsResult.updated;
  const totalErrors = pagesResult.errors.length + postsResult.errors.length;
  
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Pages processed: ${pagesResult.processed} (${pagesResult.updated} updated)`);
  console.log(`Posts processed: ${postsResult.processed} (${postsResult.updated} updated)`);
  console.log(`Total: ${totalProcessed} files (${totalUpdated} updated)`);
  
  if (totalErrors > 0) {
    console.log(`\n⚠ Errors: ${totalErrors}`);
    pagesResult.errors.forEach(err => console.log(`  - ${err}`));
    postsResult.errors.forEach(err => console.log(`  - ${err}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Date synchronization complete!');
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log('1. Run "npm run build" to regenerate the sitemap');
  console.log('2. Verify that sitemap lastmod matches page modifiedDate');
  console.log('3. Check that displayed dates on pages match JSON dates');
}

// Run the script
if (require.main === module) {
  main();
}

export { normalizeDate, updateSchemaDates, updateOpenGraphDates };

