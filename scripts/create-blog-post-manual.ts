/**
 * Manual blog post creation script
 * Run with: npx tsx scripts/create-blog-post-manual.ts
 */

import { marked } from 'marked';
import * as fs from 'fs';
import * as path from 'path';

const markdownPath = 'c:\\Users\\Svet\\Downloads\\Колко мобилен интернет е нужен за дистанционна ИТ работа в България и по света.md';
const title = 'Колко мобилен интернет е нужен за дистанционна ИТ работа в България и по света?';
const author = 'Васил Андреев';
const categories = ['eSIM технология', 'Дистанционна работа'];
const tags = ['мобилен интернет', 'дистанционна работа', 'esim', 'данни', 'трафик'];

// Generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0400-\u04FF]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[?]/g, '')
    .trim();
}

// Convert to WordPress HTML
function convertToWordPressHTML(html: string): string {
  html = html.replace(/<h2>/g, '<h2 class="wp-block-heading">');
  html = html.replace(/<h2([^>]*)>/g, (match, attrs) => {
    if (!attrs || !attrs.includes('class=')) {
      return `<h2 class="wp-block-heading"${attrs || ''}>`;
    }
    return match.replace(/class="([^"]*)"/, 'class="wp-block-heading $1"');
  });

  html = html.replace(/<h3>/g, '<h3 class="wp-block-heading">');
  html = html.replace(/<h3([^>]*)>/g, (match, attrs) => {
    if (!attrs || !attrs.includes('class=')) {
      return `<h3 class="wp-block-heading"${attrs || ''}>`;
    }
    return match.replace(/class="([^"]*)"/, 'class="wp-block-heading $1"');
  });

  html = html.replace(/<ul>/g, '<ul class="wp-block-list">');
  html = html.replace(/<ol>/g, '<ol class="wp-block-list">');

  return html;
}

function generateExcerpt(content: string): string {
  const textOnly = content.replace(/<[^>]*>/g, '').trim();
  const firstParagraph = textOnly.split('\n')[0] || textOnly;
  const truncated = firstParagraph.substring(0, 200).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  const final = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
  return `<p>${final} [&hellip;]</p>`;
}

// Read markdown
const markdown = fs.readFileSync(markdownPath, 'utf-8');

// Convert to HTML
let html = marked.parse(markdown) as string;
html = convertToWordPressHTML(html);

// Generate slug
const slug = generateSlug(title);

// Generate excerpt
const excerpt = generateExcerpt(html);

// Dates
const now = new Date();
const publishedDate = now.toISOString();
const modifiedDate = publishedDate;

// URL
const url = `https://travelesim.bg/blog/${slug}/`;

// Create blog post
const blogPost = {
  slug,
  title,
  content: html,
  excerpt,
  seo: {
    title: `${title} - Travel eSIM BG`,
    description: excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
    canonical: url,
    robots: {
      index: 'index',
      follow: 'follow'
    },
    openGraph: {
      type: 'article',
      title: `${title} - Travel eSIM BG`,
      description: excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
      url: url,
      siteName: 'Travel eSIM BG',
      images: [{
        url: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
        width: 1024,
        height: 1024,
        type: 'image/png'
      }],
      locale: 'en_GB',
      modifiedTime: modifiedDate
    },
    twitter: {
      card: 'summary_large_image',
      misc: {
        'Written by': author,
        'Estimated reading time': '5 minutes'
      }
    },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${url}#article`,
          'isPartOf': { '@id': url },
          author: {
            name: author,
            '@id': 'https://travelesim.bg/#/schema/person/f91b87636c0e34acdd581723431a1f6d'
          },
          headline: title,
          datePublished: publishedDate,
          dateModified: modifiedDate,
          mainEntityOfPage: { '@id': url },
          wordCount: html.split(/\s+/).length,
          commentCount: 0,
          publisher: { '@id': 'https://travelesim.bg/#organization' },
          image: { '@id': `${url}#primaryimage` },
          thumbnailUrl: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
          articleSection: categories,
          inLanguage: 'en-GB',
          potentialAction: [{
            '@type': 'CommentAction',
            name: 'Comment',
            target: [`${url}#respond`]
          }]
        },
        {
          '@type': 'WebPage',
          '@id': url,
          url: url,
          name: `${title} - Travel eSIM BG`,
          'isPartOf': { '@id': 'https://travelesim.bg/#website' },
          primaryImageOfPage: { '@id': `${url}#primaryimage` },
          image: { '@id': `${url}#primaryimage` },
          thumbnailUrl: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
          datePublished: publishedDate,
          dateModified: modifiedDate,
          description: excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
          breadcrumb: { '@id': `${url}#breadcrumb` },
          inLanguage: 'en-GB',
          potentialAction: [{
            '@type': 'ReadAction',
            target: [url]
          }]
        },
        {
          '@type': 'ImageObject',
          inLanguage: 'en-GB',
          '@id': `${url}#primaryimage`,
          url: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
          contentUrl: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
          width: 1024,
          height: 1024
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://travelesim.bg/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: title
            }
          ]
        }
      ]
    }
  },
  url,
  modifiedDate,
  publishedDate,
  author,
  categories,
  tags
};

// Save post
const postsDir = path.join(process.cwd(), 'data', 'processed', 'posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

const postPath = path.join(postsDir, `${slug}.json`);
fs.writeFileSync(postPath, JSON.stringify(blogPost, null, 2), 'utf-8');
console.log(`✓ Created blog post: ${postPath}`);

// Update index
const indexPath = path.join(process.cwd(), 'data', 'processed', 'posts-index.json');
let postsIndex: any[] = [];

if (fs.existsSync(indexPath)) {
  const indexData = fs.readFileSync(indexPath, 'utf-8');
  postsIndex = JSON.parse(indexData);
}

const existingIndex = postsIndex.findIndex(p => p.slug === slug);
const indexEntry = {
  slug,
  title,
  url,
  publishedDate,
  categories
};

if (existingIndex >= 0) {
  postsIndex[existingIndex] = indexEntry;
} else {
  postsIndex.unshift(indexEntry);
}

postsIndex.sort((a, b) => 
  new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
);

fs.writeFileSync(indexPath, JSON.stringify(postsIndex, null, 2), 'utf-8');
console.log(`✓ Updated posts index: ${indexPath}`);



