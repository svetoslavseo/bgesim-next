# WordPress to Next.js Migration - Travel eSIM BG

Complete migration of [travelesim.bg](https://travelesim.bg) from WordPress/Oxygen Builder to Next.js with Static Site Generation (SSG).

## 🎯 Project Goals

- **Exact Design Replication**: Match the original WordPress site pixel-perfect
- **Static Site Generation**: Full SSG for maximum performance
- **Self-hosted Fonts**: No external font dependencies
- **SEO Preservation**: Maintain all SEO optimizations from Yoast SEO
- **Complete Content Migration**: All pages, posts, media, and metadata

## 📁 Project Structure

```
wp-esim-bg-clone/
├── scripts/                      # Data extraction scripts
│   ├── fetch-wordpress-data.ts   # WordPress REST API scraper
│   ├── download-media.ts         # Media asset downloader
│   ├── extract-fonts.ts          # Font extraction & self-hosting
│   ├── scrape-pages-firecrawl.ts # Firecrawl/Chrome DevTools helper
│   ├── transform-content.ts      # Content transformation
│   └── run-all-extraction.ts     # Orchestration script
├── data/                         # Extracted & processed data
│   ├── raw/                      # Raw WordPress API data
│   ├── scraped/                  # Scraped HTML/CSS data
│   └── processed/                # Transformed Next.js-ready data
├── public/                       # Static assets
│   ├── media/                    # Downloaded images & files
│   └── fonts/                    # Self-hosted fonts
├── src/                          # Next.js application (created later)
│   ├── app/                      # Next.js 14 app directory
│   ├── components/               # React components
│   ├── lib/                      # Utilities & helpers
│   ├── styles/                   # CSS & modules
│   └── types/                    # TypeScript definitions
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Access to Chrome DevTools MCP (for CSS extraction)
- Firecrawl MCP server (for page scraping)

### Installation

```bash
# Install dependencies
npm install
```

## 📋 Migration Steps

### Phase 1: Data Extraction

#### Step 1: Extract WordPress Data

```bash
npm run extract:wordpress
```

This fetches all data from WordPress REST API:
- Pages (`/wp-json/wp/v2/pages`)
- Posts (`/wp-json/wp/v2/posts`)
- Media (`/wp-json/wp/v2/media`)
- Categories and Tags
- Yoast SEO metadata

Output: `data/raw/` directory with JSON files

#### Step 2: Download Media Assets

```bash
npm run extract:media
```

Downloads all images, videos, and files:
- Downloads to `public/media/`
- Organized by type (images, videos, documents)
- Creates URL mapping for content transformation

#### Step 3: Extract Fonts

```bash
npm run extract:fonts
```

Downloads and self-hosts all fonts:
- Identifies Google Fonts and custom fonts
- Downloads woff2/woff formats
- Generates font-face CSS declarations
- Saves to `public/fonts/`

#### Step 4: Transform Content

```bash
npm run transform:content
```

Transforms WordPress content for Next.js:
- Converts HTML content
- Updates image URLs to local paths
- Transforms internal links
- Processes Yoast SEO data
- Creates Next.js-compatible JSON files

Output: `data/processed/` directory

#### All-in-One Extraction

```bash
npm run extract:all
```

Runs all extraction steps in sequence (Steps 1-4).

#### Step 5: Manual CSS Extraction (Using Chrome DevTools MCP)

```bash
npm run extract:scrape
```

This creates template files and provides instructions for manual scraping:

1. Use Chrome DevTools MCP to open each page
2. Use `mcp_chrome-devtools_take_snapshot` to capture HTML structure
3. Inspect computed styles for each component
4. Save data to `data/scraped/pages/[slug].json`

**Required data for each page:**
- HTML structure with class names
- Computed CSS for each component
- Responsive breakpoints
- Font details
- Image dimensions

### Phase 2: Next.js Setup

#### Initialize Next.js Project

```bash
npx create-next-app@latest . --typescript --no-tailwind --app --src-dir --import-alias "@/*"
```

Answer the prompts:
- ✅ TypeScript
- ✅ App Router
- ✅ src/ directory
- ❌ No Tailwind CSS
- ✅ Import alias `@/*`

#### Install Additional Dependencies

```bash
npm install sharp sass @types/node
npm install -D @types/react @types/react-dom
```

#### Configure Next.js for SSG

Create/update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Optimize fonts
  optimizeFonts: true,
}

module.exports = nextConfig
```

### Phase 3: Component Development

Create components matching the WordPress/Oxygen Builder design:

1. **Layout Components**
   - Header
   - Footer
   - Navigation
   - Container/Section wrappers

2. **UI Components**
   - Cards (country/plan cards)
   - Buttons
   - Hero sections
   - Content blocks

3. **SEO Component**
   - Meta tags
   - Open Graph
   - JSON-LD structured data

### Phase 4: Page Generation

Implement pages using Next.js 14 App Router:

1. **Root Layout** (`src/app/layout.tsx`)
   - Global styles
   - Header/Footer
   - Font configuration
   - Default metadata

2. **Homepage** (`src/app/page.tsx`)
   - Load from `data/processed/pages/home.json`
   - Static generation with `generateMetadata()`

3. **Dynamic Pages** (`src/app/[slug]/page.tsx`)
   - Generate all pages statically
   - Use `generateStaticParams()`

4. **Blog Posts** (`src/app/blog/[slug]/page.tsx`)
   - Similar to pages route
   - Include post metadata

### Phase 5: Build & Deploy

```bash
# Build static site
npm run build

# Output will be in the `out/` directory
# Deploy to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)
```

## 🛠️ Available Scripts

### Data Extraction
- `npm run extract:all` - Run complete extraction pipeline
- `npm run extract:wordpress` - Fetch WordPress REST API data
- `npm run extract:media` - Download all media assets
- `npm run extract:fonts` - Extract and self-host fonts
- `npm run extract:scrape` - Helper for Firecrawl scraping
- `npm run transform:content` - Transform content for Next.js

### Development (After Next.js setup)
- `npm run dev` - Start development server
- `npm run build` - Build static site
- `npm run start` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 📊 Data Flow

```
WordPress Site (travelesim.bg)
    ↓
[fetch-wordpress-data.ts] → data/raw/*.json
    ↓
[download-media.ts] → public/media/* + media-mapping.json
    ↓
[extract-fonts.ts] → public/fonts/* + fonts.json
    ↓
[Chrome DevTools MCP] → data/scraped/*.json (manual)
    ↓
[transform-content.ts] → data/processed/*.json
    ↓
Next.js Components → Read from data/processed/
    ↓
[npm run build] → Static site in out/
    ↓
Deploy to CDN
```

## ✅ Quality Assurance Checklist

### Content Verification
- [ ] All pages present and rendering correctly
- [ ] All posts present with correct metadata
- [ ] All images loading properly
- [ ] Internal links working
- [ ] External links preserved

### Design Verification
- [ ] Pixel-perfect match with original site
- [ ] Responsive design working at all breakpoints
- [ ] Fonts rendering correctly
- [ ] Colors and spacing match exactly
- [ ] Hover states and interactions working

### SEO Verification
- [ ] All meta tags present (title, description)
- [ ] Open Graph tags configured
- [ ] Twitter cards configured
- [ ] Canonical URLs correct
- [ ] Structured data (JSON-LD) included
- [ ] Sitemap generated
- [ ] Robots.txt configured

### Performance
- [ ] Lighthouse score > 90
- [ ] All images optimized
- [ ] Fonts loading efficiently
- [ ] Static generation working
- [ ] Build size reasonable

## 🔍 Troubleshooting

### Missing Data
If extraction fails:
1. Check WordPress REST API is accessible
2. Verify network connection
3. Check for API rate limiting
4. Review error logs in console

### Media Download Issues
If media download fails:
1. Check file permissions in `public/media/`
2. Verify URLs in `media.json`
3. Try downloading individually
4. Check disk space

### CSS Extraction Issues
For CSS extraction with Chrome DevTools:
1. Ensure DevTools MCP server is running
2. Take detailed screenshots for reference
3. Use browser inspector to verify computed styles
4. Check for dynamically loaded styles

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress REST API Reference](https://developer.wordpress.org/rest-api/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## 📝 Notes

- The WordPress site will remain unchanged during migration
- All data is scraped and stored locally
- No WordPress dependency after migration is complete
- Site can be deployed to any static hosting provider

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review script output logs
3. Verify all prerequisites are met
4. Check data directory structure

## 📄 License

Private project - All rights reserved.



