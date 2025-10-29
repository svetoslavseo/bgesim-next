# Article Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing new blog articles in the Travel eSIM BG website. The system uses a WordPress-to-Next.js migration approach with automated content processing and static generation.

## Current System Architecture

### Data Flow
```
WordPress Site → Data Extraction → Content Processing → Static Generation → Next.js App
```

### Key Components
- **WordPress REST API**: Source of truth for content
- **Data Processing Scripts**: Transform WordPress data to Next.js format
- **Static Generation**: Pre-builds all pages at build time
- **Content Management**: JSON-based content storage

## Step-by-Step Implementation Process

### Phase 1: Content Creation in WordPress

#### 1.1 Create New Blog Post
1. **Access WordPress Admin**: Log into the WordPress admin panel
2. **Create New Post**: Go to Posts → Add New
3. **Fill Required Fields**:
   - **Title**: SEO-optimized title (Bulgarian)
   - **Content**: Full article content with proper HTML structure
   - **Excerpt**: Short description (auto-generated if not provided)
   - **Featured Image**: Upload high-quality image (1024x1024px recommended)
   - **Categories**: Assign relevant categories (e.g., "Роуминг", "eSIM")
   - **Tags**: Add relevant tags for better organization
   - **Author**: Assign to "Васил Андреев" (default author)

#### 1.2 SEO Configuration
1. **Install SEO Plugin**: Ensure Yoast SEO or similar is installed
2. **Configure Meta Data**:
   - **Meta Title**: Include "Travel eSIM BG" branding
   - **Meta Description**: 150-160 characters, compelling description
   - **Open Graph**: Set featured image for social sharing
   - **Canonical URL**: Ensure proper URL structure

#### 1.3 Content Structure Guidelines
```html
<!-- Recommended HTML structure -->
<h2 class="wp-block-heading">Section Title</h2>
<p>Introduction paragraph...</p>

<h3 class="wp-block-heading">Subsection</h3>
<ul class="wp-block-list">
  <li><strong>Bold text</strong>: Description</li>
</ul>

<div class="wp-block-table">
<table class="has-fixed-layout">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
</div>
```

### Phase 2: Data Extraction

#### 2.1 Run WordPress Data Extraction
```bash
# Navigate to project directory
cd /Users/petkovs/bgesimwp/bgesim-next

# Run the extraction script
npm run extract:wordpress
```

**What this does:**
- Fetches all posts, pages, media, categories, and tags from WordPress
- Saves raw data to `data/raw/` directory
- Creates summary of extracted content

#### 2.2 Verify Extraction
Check the following files are updated:
- `data/raw/posts.json` - Contains new post data
- `data/raw/media.json` - Contains featured image data
- `data/raw/summary.json` - Shows extraction statistics

### Phase 3: Content Processing

#### 3.1 Transform Raw Data
```bash
# Run content transformation
npm run transform:content
```

**What this does:**
- Converts WordPress data to Next.js format
- Processes HTML content and metadata
- Creates processed files in `data/processed/`
- Generates SEO metadata and structured data

#### 3.2 Content Scraping (if needed)
If the post uses Oxygen Builder or complex layouts:

```bash
# Run content scraping
npm run scrape:content
```

**Manual Scraping Process:**
1. Use Chrome DevTools MCP to navigate to the post URL
2. Extract clean HTML content
3. Save to `data/scraped-html/posts/[slug].html`

### Phase 4: Featured Image Processing

#### 4.1 Download Featured Images
```bash
# Download and optimize featured images
npm run download:featured-images
```

**What this does:**
- Downloads featured images from WordPress
- Optimizes images for web
- Saves to `public/media/blog-featured/`
- Updates `data/processed/blog-featured-images.json`

#### 4.2 Image Requirements
- **Format**: PNG or JPG
- **Size**: 1024x1024px (square format)
- **Quality**: High resolution, web-optimized
- **Naming**: `[slug].png` (e.g., `egypt-esim-image.png`)

### Phase 5: Content Integration

#### 5.1 Integrate Scraped Content
```bash
# Integrate scraped HTML into processed data
npm run integrate:content
```

**What this does:**
- Merges scraped HTML with processed data
- Updates post content with clean HTML
- Maintains SEO metadata and structure

#### 5.2 Update Index Files
The system automatically updates:
- `data/processed/posts-index.json` - Post listing
- `data/processed/pages-index.json` - Page listing

### Phase 6: Build and Deploy

#### 6.1 Build Static Site
```bash
# Build the Next.js application
npm run build
```

**What this does:**
- Generates static HTML for all pages
- Creates optimized assets
- Generates sitemap and robots.txt

#### 6.2 Test Locally
```bash
# Start local server
npm run serve
```

**Verify:**
- Post loads correctly at `/blog/[slug]/`
- Featured image displays properly
- SEO metadata is correct
- Content formatting is preserved

#### 6.3 Deploy
```bash
# Deploy to production
npm run deploy
```

## File Structure Reference

### Data Directory Structure
```
data/
├── raw/                          # Raw WordPress data
│   ├── posts.json               # All posts from WordPress
│   ├── media.json               # All media files
│   ├── categories.json          # Post categories
│   └── tags.json                # Post tags
├── processed/                    # Processed Next.js data
│   ├── posts/                   # Individual post files
│   │   └── [slug].json          # Processed post data
│   ├── pages/                   # Individual page files
│   │   └── [slug].json          # Processed page data
│   ├── posts-index.json         # Post listing
│   ├── pages-index.json         # Page listing
│   └── blog-featured-images.json # Featured image mapping
└── scraped-html/                # Scraped HTML content
    ├── posts/
    │   └── [slug].html          # Clean HTML content
    └── pages/
        └── [slug].html          # Clean HTML content
```

### Public Directory Structure
```
public/
├── media/
│   ├── blog-featured/           # Featured images
│   │   └── [slug].png          # Optimized featured images
│   └── images/                 # Other images
└── [other static assets]
```

## Content Guidelines

### Writing Style
- **Language**: Bulgarian (primary)
- **Tone**: Professional, informative, helpful
- **Length**: 800-2000 words recommended
- **Structure**: Clear headings, bullet points, tables

### SEO Best Practices
- **Title**: Include target keywords naturally
- **Meta Description**: Compelling, 150-160 characters
- **Headings**: Use H2, H3 for structure
- **Internal Links**: Link to relevant pages/posts
- **External Links**: Add `rel="noopener noreferrer"`

### Technical Requirements
- **HTML**: Clean, semantic HTML
- **Images**: Optimized, proper alt text
- **Tables**: Use WordPress table blocks
- **Lists**: Use WordPress list blocks
- **Code**: Proper escaping and formatting

## Troubleshooting

### Common Issues

#### 1. Post Not Appearing
**Symptoms**: Post doesn't show up in blog listing
**Solution**: 
- Check `data/processed/posts-index.json`
- Verify post is published in WordPress
- Re-run extraction and transformation scripts

#### 2. Featured Image Not Loading
**Symptoms**: Image shows broken or missing
**Solution**:
- Check `data/processed/blog-featured-images.json`
- Verify image exists in `public/media/blog-featured/`
- Re-run featured image download script

#### 3. Content Formatting Issues
**Symptoms**: HTML not rendering correctly
**Solution**:
- Check scraped HTML in `data/scraped-html/posts/`
- Re-run content integration script
- Verify WordPress content structure

#### 4. SEO Metadata Missing
**Symptoms**: Missing meta tags, structured data
**Solution**:
- Check WordPress SEO plugin configuration
- Verify post has proper meta description
- Re-run content transformation

### Debug Commands
```bash
# Check extraction status
npm run extract:wordpress

# Verify processed data
npm run transform:content

# Test local build
npm run build && npm run serve

# Check specific post
node -e "console.log(require('./data/processed/posts/[slug].json'))"
```

## Automation Scripts

### Available Scripts
```bash
# Full extraction and processing
npm run extract:all

# Individual steps
npm run extract:wordpress      # Extract from WordPress
npm run transform:content      # Transform data
npm run scrape:content        # Scrape HTML content
npm run download:featured-images # Download images
npm run integrate:content    # Integrate scraped content
npm run build                # Build static site
npm run serve                # Serve locally
```

### Custom Scripts
Create custom scripts in `scripts/` directory:
- `scripts/[custom-name].ts` - TypeScript scripts
- `scripts/[custom-name].sh` - Shell scripts

## Quality Assurance

### Pre-Deployment Checklist
- [ ] Post appears in WordPress admin
- [ ] Featured image uploaded and optimized
- [ ] SEO metadata configured
- [ ] Content structure follows guidelines
- [ ] Data extraction completed successfully
- [ ] Content processing completed
- [ ] Featured image downloaded
- [ ] Local build successful
- [ ] Post displays correctly locally
- [ ] SEO metadata verified
- [ ] Mobile responsiveness checked

### Performance Considerations
- **Image Optimization**: All images should be web-optimized
- **Content Length**: Keep content focused and scannable
- **Loading Speed**: Test page load times
- **SEO Score**: Use tools like PageSpeed Insights

## Maintenance

### Regular Tasks
1. **Weekly**: Check for new posts in WordPress
2. **Monthly**: Review and update featured images
3. **Quarterly**: Audit content performance and SEO
4. **Annually**: Review and update content guidelines

### Content Updates
To update existing posts:
1. Edit in WordPress admin
2. Re-run extraction and processing scripts
3. Rebuild and deploy
4. Verify changes in production

## Support and Resources

### Documentation
- `BLOG-LAYOUT-REFERENCE.md` - Layout structure reference
- `BLOG-POST-REDESIGN-COMPLETE.md` - Design implementation details
- `FINAL-STATUS.md` - Current system status

### Key Files
- `src/app/blog/[slug]/page.tsx` - Blog post page component
- `src/lib/content.ts` - Content loading utilities
- `src/types/content.ts` - TypeScript type definitions

### Contact
For technical issues or questions about the implementation process, refer to the project documentation or contact the development team.

---

**Last Updated**: October 28, 2025
**Version**: 1.0
**Status**: Complete and Ready for Use

