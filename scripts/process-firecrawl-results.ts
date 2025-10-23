/**
 * Process Firecrawl Results to HTML
 * Converts Firecrawl markdown results to HTML for Next.js pages
 */

import { marked } from 'marked';
import * as fs from 'fs';
import * as path from 'path';

const SCRAPED_HTML_DIR = path.join(process.cwd(), 'data', 'scraped-html');

/**
 * Convert markdown to HTML and save
 */
function saveMarkdownAsHTML(slug: string, markdown: string, type: 'pages' | 'posts' = 'pages'): void {
  const dir = path.join(SCRAPED_HTML_DIR, type);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Remove cookie consent and navigation elements
  let cleaned = markdown
    .replace(/!\[Revisit consent button\][\s\S]*?Приеми всички/gm, '')
    .replace(/Customise Consent Preferences[\s\S]*?Приеми всички/gm, '')
    .replace(/Езици\n\n-.*?\[България\][\s\S]*?Romania\]\(https:\/\/travelesim\.ro\/\)/gm, '')
    .replace(/\[Visit our Facebook\][\s\S]*?© 2025, Developed by Travel eSIM by Breeze/gm, '')
    .replace(/closechevron-down.*?twitterinstagram$/gm, '')
    .trim();
  
  // Convert markdown to HTML
  const html = marked.parse(cleaned) as string;
  
  // Wrap in main content div
  const wrappedHTML = `<div id="main-content" class="ct-section page-content">\n${html}\n</div>`;
  
  // Save to file
  const filePath = path.join(dir, `${slug}.html`);
  fs.writeFileSync(filePath, wrappedHTML, 'utf-8');
  
  console.log(`✓ Saved: ${type}/${slug}.html`);
}

export { saveMarkdownAsHTML };

