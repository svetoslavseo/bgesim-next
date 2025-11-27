/**
 * Create blog post from markdown file
 * Converts markdown content to WordPress-style HTML and creates blog post JSON
 */

import { marked } from 'marked';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0400-\u04FF]/g, '') // Remove special chars, keep Cyrillic
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Convert markdown headings to WordPress-style HTML
 */
function convertToWordPressHTML(html: string): string {
  // Convert h2 to WordPress format
  html = html.replace(/<h2>/g, '<h2 class="wp-block-heading">');
  html = html.replace(/<h2([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('class=')) {
      return `<h2 class="wp-block-heading"${attrs}>`;
    }
    return match.replace(/class="([^"]*)"/, 'class="wp-block-heading $1"');
  });

  // Convert h3 to WordPress format
  html = html.replace(/<h3>/g, '<h3 class="wp-block-heading">');
  html = html.replace(/<h3([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('class=')) {
      return `<h3 class="wp-block-heading"${attrs}>`;
    }
    return match.replace(/class="([^"]*)"/, 'class="wp-block-heading $1"');
  });

  // Convert lists to WordPress format
  html = html.replace(/<ul>/g, '<ul class="wp-block-list">');
  html = html.replace(/<ol>/g, '<ol class="wp-block-list">');

  // Ensure paragraphs have proper spacing
  html = html.replace(/<p>/g, '<p>');
  html = html.replace(/<\/p>/g, '</p>');

  return html;
}

/**
 * Generate excerpt from content (first paragraph, truncated)
 */
function generateExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags for excerpt
  const textOnly = content.replace(/<[^>]*>/g, '').trim();
  const firstParagraph = textOnly.split('\n')[0] || textOnly;
  
  if (firstParagraph.length <= maxLength) {
    return `<p>${firstParagraph} [&hellip;]</p>`;
  }
  
  const truncated = firstParagraph.substring(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  const final = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
  
  return `<p>${final} [&hellip;]</p>`;
}

/**
 * Create blog post from markdown
 */
function createBlogPostFromMarkdown(
  markdownPath: string,
  title: string,
  author: string = 'Васил Андреев',
  categories: string[] = ['Uncategorized'],
  tags: string[] = []
): void {
  // Read markdown file
  const markdown = fs.readFileSync(markdownPath, 'utf-8');
  
  // Generate slug
  const slug = generateSlug(title);
  
  // Convert markdown to HTML
  let html = marked.parse(markdown) as string;
  
  // Convert to WordPress-style HTML
  html = convertToWordPressHTML(html);
  
  // Generate excerpt
  const excerpt = generateExcerpt(html);
  
  // Current date
  const now = new Date();
  const publishedDate = now.toISOString();
  const modifiedDate = publishedDate;
  
  // Generate URL
  const url = `https://travelesim.bg/blog/${slug}/`;
  
  // Create SEO data
  const seo = {
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
      images: [
        {
          url: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
          width: 1024,
          height: 1024,
          type: 'image/png'
        }
      ],
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
          'isPartOf': {
            '@id': url
          },
          author: {
            name: author,
            '@id': 'https://travelesim.bg/#/schema/person/f91b87636c0e34acdd581723431a1f6d'
          },
          headline: title,
          datePublished: publishedDate,
          dateModified: modifiedDate,
          mainEntityOfPage: {
            '@id': url
          },
          wordCount: html.split(/\s+/).length,
          commentCount: 0,
          publisher: {
            '@id': 'https://travelesim.bg/#organization'
          },
          image: {
            '@id': `${url}#primaryimage`
          },
          thumbnailUrl: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
          articleSection: categories,
          inLanguage: 'en-GB',
          potentialAction: [
            {
              '@type': 'CommentAction',
              name: 'Comment',
              target: [
                `${url}#respond`
              ]
            }
          ]
        },
        {
          '@type': 'WebPage',
          '@id': url,
          url: url,
          name: `${title} - Travel eSIM BG`,
          'isPartOf': {
            '@id': 'https://travelesim.bg/#website'
          },
          primaryImageOfPage: {
            '@id': `${url}#primaryimage`
          },
          image: {
            '@id': `${url}#primaryimage`
          },
          thumbnailUrl: 'https://travelesim.bg/wp-content/uploads/2025/10/Feature-image.png',
          datePublished: publishedDate,
          dateModified: modifiedDate,
          description: excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
          breadcrumb: {
            '@id': `${url}#breadcrumb`
          },
          inLanguage: 'en-GB',
          potentialAction: [
            {
              '@type': 'ReadAction',
              target: [
                url
              ]
            }
          ]
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
  };
  
  // Create blog post object
  const blogPost = {
    slug,
    title,
    content: html,
    excerpt,
    seo,
    url,
    modifiedDate,
    publishedDate,
    author,
    categories,
    tags
  };
  
  // Save to posts directory
  const postsDir = path.join(process.cwd(), 'data', 'processed', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  const postPath = path.join(postsDir, `${slug}.json`);
  fs.writeFileSync(postPath, JSON.stringify(blogPost, null, 2), 'utf-8');
  console.log(`✓ Created blog post: ${postPath}`);
  
  // Update posts index
  const indexPath = path.join(process.cwd(), 'data', 'processed', 'posts-index.json');
  let postsIndex: any[] = [];
  
  if (fs.existsSync(indexPath)) {
    const indexData = fs.readFileSync(indexPath, 'utf-8');
    postsIndex = JSON.parse(indexData);
  }
  
  // Check if post already exists in index
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
    // Add to beginning (most recent first)
    postsIndex.unshift(indexEntry);
  }
  
  // Sort by published date (most recent first)
  postsIndex.sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  fs.writeFileSync(indexPath, JSON.stringify(postsIndex, null, 2), 'utf-8');
  console.log(`✓ Updated posts index: ${indexPath}`);
}

// Main execution
if (require.main === module) {
  const markdownPath = process.argv[2];
  const title = process.argv[3];
  const author = process.argv[4] || 'Васил Андреев';
  const categories = process.argv[5] ? process.argv[5].split(',') : ['Uncategorized'];
  const tags = process.argv[6] ? process.argv[6].split(',') : [];
  
  if (!markdownPath || !title) {
    console.error('Usage: tsx scripts/create-blog-post-from-markdown.ts <markdown-path> <title> [author] [categories] [tags]');
    process.exit(1);
  }
  
  createBlogPostFromMarkdown(markdownPath, title, author, categories, tags);
}

export { createBlogPostFromMarkdown };



