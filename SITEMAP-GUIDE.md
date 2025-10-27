# Sitemap Guide

## Automatic Sitemap Inclusion

Your sitemap automatically includes all pages and blog posts from your data files. No manual intervention is needed.

## How It Works

The sitemap is generated from:
1. **Pages**: `data/processed/pages-index.json` + individual page files in `data/processed/pages/`
2. **Blog Posts**: `data/processed/posts-index.json` + individual post files in `data/processed/posts/`

The sitemap generation code in `src/app/sitemap.ts` reads these indexes and automatically includes every page.

## Adding a New Page to the Sitemap

To add a new page to your sitemap, simply follow these steps:

### Step 1: Add the Page Data File

Create a new file in `data/processed/pages/[your-page-slug].json`:

```json
{
  "slug": "your-page-slug",
  "title": "Your Page Title",
  "content": "Your page content...",
  "modifiedDate": "2025-10-27T00:00:00.000Z",
  "seo": {
    "title": "SEO Title",
    "description": "SEO Description"
  }
}
```

### Step 2: Add to Pages Index

Add an entry to `data/processed/pages-index.json`:

```json
{
  "slug": "your-page-slug",
  "title": "Your Page Title",
  "url": "https://travelesim.bg/your-page-slug/"
}
```

### Step 3: Create the Next.js Route (if needed)

If you need a custom page component, create it in `src/app/[your-page-slug]/page.tsx`.

### Step 4: Build the Site

Run `npm run build` and the new page will automatically be included in the sitemap.

## Adding a New Blog Post

Posts work the same way:

### Step 1: Add Post Data File

Create `data/processed/posts/[your-post-slug].json`

### Step 2: Add to Posts Index

Add entry to `data/processed/posts-index.json`

### Step 3: Build

The post will appear in the sitemap automatically.

## What's Automatically Included

The sitemap includes:
- ✅ All pages from `pages-index.json`
- ✅ All blog posts from `posts-index.json`
- ✅ Homepage
- ✅ Blog index page (`/blog/`)
- ✅ Manually added static pages (like `/durjavi/`)

## What's NOT Included

- ❌ API routes (`/api/*`)
- ❌ Server-side routes
- ❌ Pages not in the index
- ❌ Checkout page (removed by design)

## Testing

To verify a page is in your sitemap:

1. Run `npm run build`
2. Check `out/sitemap.xml`
3. Search for your page URL

## Customizing the Sitemap

Edit `src/app/sitemap.ts` to modify:
- URL generation logic
- What pages to include/exclude
- lastmod dates
- etc.

The sitemap is regenerated on every build, so changes are reflected immediately.

