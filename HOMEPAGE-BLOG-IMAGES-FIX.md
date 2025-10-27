# Homepage Blog Images Fix

## Issue
Blog post images in the homepage "Последни публикации" section were not rendering and appeared as empty dark grey rectangles instead of the featured images.

## Root Cause
The `getPostBySlug()` function in `src/lib/content.ts` was extracting featured image URLs from the SEO metadata, which contained old WordPress URLs pointing to `https://travelesim.bg/wp-content/uploads/...` instead of the local image paths.

While there was already a local image mapping file (`data/processed/blog-featured-images.json`) that correctly mapped slugs to local paths, and the images themselves existed in `public/media/blog-featured/`, the `getPostBySlug()` function was not using this mapping.

## Solution
Updated `src/lib/content.ts` to:

1. **Load the local featured images mapping** - Added a new `getBlogFeaturedImagesMap()` function that loads the `blog-featured-images.json` file
2. **Use local images first** - Modified `getPostBySlug()` to prioritize the local featured image mapping over the WordPress URLs
3. **Fallback logic** - If a local image exists in the mapping, use it; otherwise, fall back to the SEO metadata URL

### Code Changes

#### `src/lib/content.ts`
```typescript
function getBlogFeaturedImagesMap(): Record<string, string> {
  const mappingPath = path.join(DATA_DIR, 'blog-featured-images.json');
  
  if (!fs.existsSync(mappingPath)) {
    return {};
  }
  
  const data = fs.readFileSync(mappingPath, 'utf-8');
  return JSON.parse(data);
}

export function getPostBySlug(slug: string): ProcessedPost | null {
  // ... existing code ...
  
  // Get local featured images mapping
  const featuredImagesMap = getBlogFeaturedImagesMap();
  
  // Use local featured image if available, otherwise fall back to SEO metadata
  if (featuredImagesMap[slug]) {
    post.featuredImageUrl = featuredImagesMap[slug];
  } else if (!post.featuredImageUrl && post.seo?.openGraph?.images?.[0]?.url) {
    post.featuredImageUrl = post.seo.openGraph.images[0].url;
  }
  
  return post;
}
```

#### Additional Cleanup

Also simplified the blog post pages to use `post.featuredImageUrl` directly instead of importing the mapping separately:

- `src/app/blog/[slug]/page.tsx` - Removed direct import of `featuredImagesMap` JSON
- `src/app/blog/page.tsx` - Removed direct import of `featuredImagesMap` JSON

## Verification
- All 7 blog post images exist in `public/media/blog-featured/`
- Mapping file correctly references all image paths
- Build completed successfully with no errors
- Homepage now uses local image paths like `/media/blog-featured/kak-da-proverq-dali-imam-rouming.png` instead of WordPress URLs

## Files Modified
1. `src/lib/content.ts` - Added featured images mapping logic
2. `src/app/blog/[slug]/page.tsx` - Simplified to use `post.featuredImageUrl`
3. `src/app/blog/page.tsx` - Simplified to use `post.featuredImageUrl`

## Date
January 2025

