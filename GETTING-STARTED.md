# Getting Started Guide

Quick start guide to get your WordPress to Next.js migration up and running.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Access to the WordPress site (https://travelesim.bg)
- Chrome browser with DevTools
- Firecrawl MCP server (optional, for advanced CSS extraction)

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required dependencies including Next.js, TypeScript, and build tools.

### Step 2: Extract WordPress Data

Run the complete extraction pipeline:

```bash
npm run extract:all
```

This will:
- Fetch all pages, posts, and media from WordPress REST API
- Download all images and files to `public/media/`
- Extract and download fonts to `public/fonts/`
- Transform content for Next.js

**What gets extracted:**
- ✅ All pages with content and SEO metadata
- ✅ All blog posts with categories and tags
- ✅ All media files (images, videos, documents)
- ✅ Fonts (Google Fonts converted to self-hosted)
- ✅ Yoast SEO data (meta tags, Open Graph, structured data)

**Expected output:**
```
data/raw/
  ├── pages.json
  ├── posts.json
  ├── media.json
  ├── categories.json
  ├── tags.json
  └── site-info.json

data/processed/
  ├── pages/
  ├── posts/
  ├── pages-index.json
  └── posts-index.json

public/media/
  ├── images/
  ├── videos/
  └── documents/

public/fonts/
  └── [font-files].woff2
```

### Step 3: (Optional) Extract CSS Styles

For pixel-perfect design matching, manually extract CSS using Chrome DevTools:

```bash
npm run extract:scrape
```

This creates template files in `data/scraped/` with instructions for manual CSS extraction.

**Manual CSS extraction process:**

1. Open the site in Chrome
2. Use DevTools → Elements panel
3. For each component, note:
   - HTML structure and class names
   - Computed CSS properties
   - Responsive breakpoints
   - Colors, spacing, typography
4. Save to `data/scraped/pages/[slug].json`
5. Update component CSS modules with extracted styles

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- Homepage with WordPress content
- Navigation menu
- Blog listing at `/blog/`
- Individual blog posts at `/blog/[slug]/`
- All other pages at `/[slug]/`

### Step 5: Customize Design

Update the component CSS modules to match the exact WordPress design:

1. **Update global styles:** `src/styles/globals.css`
2. **Update design tokens:** `src/styles/variables.module.css`
3. **Update component styles:**
   - `src/components/common/*.module.css`
   - `src/components/ui/*.module.css`
   - `src/components/layout/*.module.css`

### Step 6: Build for Production

```bash
npm run build
```

This generates a fully static site in the `out/` directory.

**Build output:**
- Static HTML for all pages
- Optimized CSS and JavaScript
- All assets (images, fonts)
- Sitemap and robots.txt

### Step 7: Preview Production Build

```bash
# Serve the built site locally
npx serve out

# Or use any static file server
python -m http.server -d out 8000
```

### Step 8: Deploy

Deploy the `out/` directory to any static hosting platform:

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=out

# Or upload to any web server
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
wp-esim-bg-clone/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── [slug]/            # Dynamic pages
│   │   ├── blog/              # Blog section
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── sitemap.ts         # Sitemap generation
│   │   └── robots.ts          # Robots.txt
│   ├── components/
│   │   ├── common/            # Header, Footer, Navigation
│   │   ├── layout/            # Container, Section
│   │   └── ui/                # Button, Card, Hero, etc.
│   ├── lib/
│   │   ├── content.ts         # Content loading
│   │   ├── seo.ts             # SEO utilities
│   │   └── utils.ts           # Helper functions
│   ├── styles/
│   │   ├── globals.css        # Global styles
│   │   ├── fonts.css          # Font declarations
│   │   └── variables.module.css # Design tokens
│   └── types/
│       ├── wordpress.ts       # WordPress types
│       └── content.ts         # Content types
├── scripts/
│   ├── fetch-wordpress-data.ts    # WordPress API scraper
│   ├── download-media.ts          # Media downloader
│   ├── extract-fonts.ts           # Font extractor
│   ├── transform-content.ts       # Content transformer
│   └── run-all-extraction.ts      # Orchestration
├── data/
│   ├── raw/                   # Raw WordPress data
│   ├── processed/             # Transformed data
│   └── scraped/               # Scraped HTML/CSS
├── public/
│   ├── media/                 # Downloaded images/files
│   └── fonts/                 # Self-hosted fonts
├── package.json
├── tsconfig.json
├── next.config.js
├── README.md
├── GETTING-STARTED.md (this file)
└── DEPLOYMENT.md
```

## 🛠️ Available Scripts

### Data Extraction
- `npm run extract:all` - Run complete extraction pipeline
- `npm run extract:wordpress` - Fetch WordPress data only
- `npm run extract:media` - Download media only
- `npm run extract:fonts` - Extract fonts only
- `npm run extract:scrape` - Prepare for CSS scraping
- `npm run transform:content` - Transform data only

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🎨 Customization Guide

### Adding New Components

1. Create component file: `src/components/ui/MyComponent.tsx`
2. Create CSS module: `src/components/ui/MyComponent.module.css`
3. Import and use in pages

Example:

```tsx
// src/components/ui/MyComponent.tsx
import styles from './MyComponent.module.css';

export default function MyComponent() {
  return <div className={styles.myComponent}>Hello</div>;
}
```

### Modifying Navigation

Edit `src/components/common/Navigation.tsx`:

```tsx
const navigationItems = [
  { label: 'Начало', href: '/' },
  { label: 'Блог', href: '/blog/' },
  { label: 'За нас', href: '/about/' },
  // Add more items
];
```

### Adding Custom Pages

1. Create page file: `src/app/my-page/page.tsx`
2. Add content and metadata
3. Build - page will be statically generated

### Updating SEO Defaults

Edit `src/lib/seo.ts`:

```typescript
export const SITE_CONFIG = {
  name: 'Your Site Name',
  description: 'Your description',
  url: 'https://yoursite.com',
  // ...
};
```

## 🔍 Troubleshooting

### No content appears

**Issue:** Pages show "Run extraction scripts" message

**Solution:**
```bash
npm run extract:all
```

Wait for extraction to complete, then refresh the page.

### Build errors

**Issue:** TypeScript or build errors

**Solution:**
```bash
# Check TypeScript
npm run type-check

# Fix linting issues
npm run lint --fix

# Clear Next.js cache
rm -rf .next out
npm run build
```

### Images not loading

**Issue:** Images showing broken links

**Solution:**
- Verify images in `public/media/images/`
- Check `data/raw/media-mapping.json` exists
- Re-run: `npm run extract:media`

### Fonts not applying

**Issue:** System fonts instead of custom fonts

**Solution:**
1. Run `npm run extract:fonts`
2. Check `public/fonts/` for font files
3. Update `src/styles/fonts.css` with correct paths
4. Clear browser cache

### Slow build times

**Issue:** Build takes a long time

**Solution:**
- This is normal for SSG with many pages
- First build caches and subsequent builds are faster
- Consider using ISR (Incremental Static Regeneration) if needed

## 📚 Next Steps

1. **Review extracted content** in `data/processed/`
2. **Customize styles** to match WordPress site exactly
3. **Test all pages** for content accuracy
4. **Optimize images** if needed
5. **Set up deployment** to your preferred platform
6. **Configure custom domain**
7. **Set up monitoring and analytics**

## 🆘 Getting Help

- Review the [README.md](./README.md) for detailed information
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
- Consult [Next.js documentation](https://nextjs.org/docs)
- Review [TypeScript handbook](https://www.typescriptlang.org/docs/)

## ✅ Checklist

Use this checklist to track your progress:

- [ ] Installed dependencies
- [ ] Extracted WordPress data
- [ ] Verified data in `data/` directory
- [ ] Started development server
- [ ] Reviewed homepage content
- [ ] Checked all pages load
- [ ] Reviewed blog posts
- [ ] Extracted CSS styles (optional)
- [ ] Customized design
- [ ] Built for production
- [ ] Tested production build
- [ ] Deployed to hosting platform
- [ ] Configured custom domain
- [ ] Verified SEO metadata
- [ ] Tested on mobile devices
- [ ] Set up analytics
- [ ] Completed migration!

Congratulations on migrating your WordPress site to Next.js! 🎉



