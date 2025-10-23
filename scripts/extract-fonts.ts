/**
 * Font Extraction Script
 * Identifies and downloads fonts for self-hosting
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const PUBLIC_FONTS_DIR = path.join(process.cwd(), 'public', 'fonts');
const DATA_DIR = path.join(process.cwd(), 'data');

interface FontInfo {
  family: string;
  weights: number[];
  styles: string[];
  source: string;
  files: FontFile[];
}

interface FontFile {
  weight: number;
  style: string;
  format: string;
  url?: string;
  localPath: string;
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
    const protocol = url.startsWith('https') ? https : http;

    const file = fs.createWriteStream(outputPath);

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(outputPath);
        if (response.headers.location) {
          downloadFile(response.headers.location, outputPath)
            .then(resolve)
            .catch(reject);
        }
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`Failed: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

/**
 * Download Google Fonts
 */
async function downloadGoogleFont(
  family: string,
  weights: number[],
  styles: string[] = ['normal']
): Promise<FontInfo> {
  console.log(`\nProcessing Google Font: ${family}`);

  const fontInfo: FontInfo = {
    family,
    weights,
    styles,
    source: 'Google Fonts',
    files: []
  };

  // Create family directory
  const familyDir = path.join(PUBLIC_FONTS_DIR, family.toLowerCase().replace(/\s+/g, '-'));
  ensureDirectoryExists(familyDir);

  // Build Google Fonts API URL
  const weightsParam = weights.join(';');
  const stylesParam = styles.includes('italic') ? 'ital,' : '';
  const fontUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:${stylesParam}wght@${weightsParam}&display=swap`;

  console.log(`  Fetching CSS from: ${fontUrl}`);

  try {
    // Fetch the CSS file
    const cssContent = await new Promise<string>((resolve, reject) => {
      https.get(fontUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });

    // Extract woff2 URLs from CSS
    const woff2Regex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g;
    const matches = cssContent.matchAll(woff2Regex);

    for (const match of matches) {
      const fontFileUrl = match[1];
      if (!fontFileUrl) continue;
      
      // Extract weight and style from context (basic parsing)
      // This is a simplified version - might need enhancement
      const weight: number = weights.length > 0 ? weights[fontInfo.files.length % weights.length] || 400 : 400;
      const style: string = styles.length > 0 ? styles[0] || 'normal' : 'normal';
      
      const filename = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}${style !== 'normal' ? '-' + style : ''}.woff2`;
      const localPath = path.join(familyDir, filename);

      console.log(`  Downloading: ${filename}`);
      await downloadFile(fontFileUrl, localPath);

      fontInfo.files.push({
        weight,
        style,
        format: 'woff2',
        url: fontFileUrl,
        localPath: `/fonts/${path.basename(familyDir)}/${filename}`
      });

      console.log(`  ✓ Downloaded: ${filename}`);
    }

  } catch (error: any) {
    console.error(`  ✗ Error: ${error.message}`);
  }

  return fontInfo;
}

/**
 * Generate font-face CSS
 */
function generateFontFaceCSS(fonts: FontInfo[]): string {
  let css = '/* Self-hosted fonts */\n\n';

  for (const font of fonts) {
    for (const file of font.files) {
      css += `@font-face {\n`;
      css += `  font-family: '${font.family}';\n`;
      css += `  font-style: ${file.style};\n`;
      css += `  font-weight: ${file.weight};\n`;
      css += `  font-display: swap;\n`;
      css += `  src: url('${file.localPath}') format('${file.format}');\n`;
      css += `}\n\n`;
    }
  }

  return css;
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Font Extraction Script');
  console.log('='.repeat(60));
  console.log(`Target: ${PUBLIC_FONTS_DIR}\n`);

  ensureDirectoryExists(PUBLIC_FONTS_DIR);

  // Default fonts commonly used on WordPress sites
  // TODO: Update this list based on actual fonts found during scraping
  const fontsToDownload = [
    { family: 'Roboto', weights: [300, 400, 500, 700], styles: ['normal'] },
    { family: 'Open Sans', weights: [400, 600, 700], styles: ['normal'] },
    { family: 'Poppins', weights: [400, 500, 600, 700], styles: ['normal'] },
  ];

  console.log('NOTE: This script downloads common fonts.');
  console.log('After scraping the site with Chrome DevTools, update the font list');
  console.log('in this script to match the actual fonts used.\n');

  console.log(`Downloading ${fontsToDownload.length} font families...`);

  const downloadedFonts: FontInfo[] = [];

  for (const fontConfig of fontsToDownload) {
    const fontInfo = await downloadGoogleFont(
      fontConfig.family,
      fontConfig.weights,
      fontConfig.styles
    );
    downloadedFonts.push(fontInfo);
  }

  // Save font metadata
  const fontsJsonPath = path.join(DATA_DIR, 'fonts.json');
  fs.writeFileSync(
    fontsJsonPath,
    JSON.stringify(downloadedFonts, null, 2),
    'utf-8'
  );
  console.log(`\n✓ Font metadata saved to: ${fontsJsonPath}`);

  // Generate font-face CSS
  const fontCSS = generateFontFaceCSS(downloadedFonts);
  const fontCSSPath = path.join(process.cwd(), 'src', 'styles', 'fonts.css');
  
  // Create styles directory if it doesn't exist
  const stylesDir = path.dirname(fontCSSPath);
  if (fs.existsSync(stylesDir)) {
    fs.writeFileSync(fontCSSPath, fontCSS, 'utf-8');
    console.log(`✓ Font CSS generated: ${fontCSSPath}`);
  } else {
    console.log(`⚠ Styles directory not found. Will create fonts.css after Next.js setup.`);
    // Save to data directory temporarily
    const tempPath = path.join(DATA_DIR, 'fonts.css');
    fs.writeFileSync(tempPath, fontCSS, 'utf-8');
    console.log(`✓ Font CSS saved temporarily to: ${tempPath}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✓ FONT EXTRACTION COMPLETED');
  console.log('='.repeat(60));
  console.log(`\nTotal font families: ${downloadedFonts.length}`);
  console.log(`Total font files: ${downloadedFonts.reduce((sum, f) => sum + f.files.length, 0)}`);
  console.log('\nNext steps:');
  console.log('1. Use Chrome DevTools to verify which fonts are actually used');
  console.log('2. Update the font list in this script if needed');
  console.log('3. Re-run this script to download the correct fonts\n');
}

// Run the script
if (require.main === module) {
  main();
}

export { downloadGoogleFont, generateFontFaceCSS };



