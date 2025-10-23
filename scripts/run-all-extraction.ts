/**
 * Run All Extraction Scripts
 * Orchestrates the complete data extraction process
 */

import { execSync } from 'child_process';
import * as path from 'path';

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

/**
 * Run a script and handle output
 */
function runScript(scriptName: string, description: string): void {
  console.log('\n' + '='.repeat(60));
  console.log(`RUNNING: ${description}`);
  console.log('='.repeat(60) + '\n');

  try {
    execSync(`tsx ${path.join(SCRIPTS_DIR, scriptName)}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    console.log(`\n✓ ${description} completed successfully\n`);
  } catch (error: any) {
    console.error(`\n❌ ${description} failed:`, error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(10) + 'WORDPRESS TO NEXT.JS MIGRATION' + ' '.repeat(17) + '║');
  console.log('║' + ' '.repeat(15) + 'Data Extraction Pipeline' + ' '.repeat(19) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');

  console.log('\nThis script will run all data extraction steps in sequence:\n');
  console.log('  1. Fetch WordPress REST API data');
  console.log('  2. Download all media assets');
  console.log('  3. Extract and download fonts');
  console.log('  4. Transform content for Next.js');
  console.log('\nNote: Firecrawl scraping must be done manually with Chrome DevTools MCP');

  try {
    // Step 1: Fetch WordPress data
    runScript('fetch-wordpress-data.ts', 'WordPress REST API Data Fetch');

    // Step 2: Download media
    runScript('download-media.ts', 'Media Assets Download');

    // Step 3: Extract fonts
    runScript('extract-fonts.ts', 'Font Extraction and Self-hosting');

    // Step 4: Transform content
    runScript('transform-content.ts', 'Content Transformation');

    // Final summary
    console.log('\n' + '╔' + '═'.repeat(58) + '╗');
    console.log('║' + ' '.repeat(58) + '║');
    console.log('║' + ' '.repeat(10) + '✓ ALL EXTRACTION STEPS COMPLETED' + ' '.repeat(15) + '║');
    console.log('║' + ' '.repeat(58) + '║');
    console.log('╚' + '═'.repeat(58) + '╝\n');

    console.log('Next steps:\n');
    console.log('1. Use Chrome DevTools MCP to scrape page styles:');
    console.log('   - Run: tsx scripts/scrape-pages-firecrawl.ts');
    console.log('   - Follow the instructions to manually scrape each page\n');
    console.log('2. Review the extracted data in the data/ directory\n');
    console.log('3. Initialize Next.js project:');
    console.log('   - Run: npm run init-nextjs\n');
    console.log('4. Start building components and pages\n');

  } catch (error: any) {
    console.error('\n╔' + '═'.repeat(58) + '╗');
    console.error('║' + ' '.repeat(58) + '║');
    console.error('║' + ' '.repeat(10) + '❌ EXTRACTION PIPELINE FAILED' + ' '.repeat(18) + '║');
    console.error('║' + ' '.repeat(58) + '║');
    console.error('╚' + '═'.repeat(58) + '╝\n');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}



