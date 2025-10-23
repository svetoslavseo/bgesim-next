# Oxygen Builder Content Solution

## 🚨 Problem Identified

**Oxygen Builder does NOT expose page content through WordPress REST API.**

When we ran the data extraction, the WordPress API returned:
```json
"content": {
  "rendered": "",
  "protected": false
}
```

This is because Oxygen Builder stores its page designs in **custom meta fields** that aren't exposed through the standard WordPress REST API endpoints.

## ✅ Solution Implemented

### What We Did:

1. **Created Scraping Scripts**
   - `scripts/scrape-oxygen-content.ts` - Prepares directory structure for scraped content
   - `scripts/integrate-scraped-content.ts` - Integrates HTML into Next.js pages

2. **Scraped Actual Content**
   Using Chrome DevTools MCP, we captured the rendered HTML from:
   - ✅ Homepage (`/` - saved as `en.html`)
   - ✅ Egypt Page (`/esim-egipet/`)

3. **Integrated Content**
   - Homepage now has full content (hero, destinations, benefits, etc.)
   - Egypt page now has full content (plans, activation steps, etc.)

### Current Status:

**Pages with Content:**
- ✅ Homepage (http://localhost:3000)
- ✅ Egypt Page (http://localhost:3000/esim-egipet/)

**Pages Still Need Scraping (12 pages):**
- ⏳ Serbia (`/esim-serbia/`)
- ⏳ Dubai (`/esim-dubai/`)
- ⏳ Thailand (`/esim-thailand/`)
- ⏳ UK (`/esim-velikobritania/`)
- ⏳ USA (`/esim-za-usa/`)
- ⏳ Turkey (`/turcia/`)
- ⏳ Contacts (`/contacts/`)
- ⏳ Calculator (`/calculator-za-izpolzvani-mobilni-danni/`)
- ⏳ Compatibility (`/proverka-na-syvmestimost-s-esim/`)
- ⏳ Blog index (`/blog/`)
- ⏳ Privacy Policy (`/privacy-policy/`)
- ⏳ V. Andreev (`/v-andreev/`)

**Blog Posts Still Need Scraping (7 posts):**
- ⏳ What is eSIM
- ⏳ eSIM vs SIM Card
- ⏳ Compatible Phones
- ⏳ And 4 more...

## 🎯 How to Complete the Migration

### Option 1: Gradual Scraping (Recommended)

Scrape pages as needed, starting with the most important:

1. **Priority Pages** (scrape these next):
   ```
   /esim-velikobritania/  (UK - popular destination)
   /esim-za-usa/          (USA - popular destination)
   /turcia/               (Turkey - popular destination)
   /esim-thailand/        (Thailand - popular destination)
   ```

2. **How to Scrape Each Page:**
   
   a. Use Chrome DevTools MCP:
   ```bash
   # Navigate to page
   mcp_chrome-devtools_navigate_page("https://travelesim.bg/esim-velikobritania/")
   
   # Take snapshot
   mcp_chrome-devtools_take_snapshot()
   
   # Extract HTML and create file
   # Save to: data/scraped-html/pages/esim-velikobritania.html
   ```
   
   b. Integrate content:
   ```bash
   npm run integrate:scraped
   ```

### Option 2: Bulk Scraping

Scrape all remaining pages at once:

1. **Use Browser DevTools** (Manual Method):
   - Open https://travelesim.bg/[page-slug]/
   - Right-click on main content → Inspect
   - Find the main content container (`<div id="main-content">` or similar)
   - Right-click element → Copy → Copy outerHTML
   - Save to `data/scraped-html/pages/[slug].html`

2. **Repeat for all pages** listed in `data/pages-to-scrape.txt`

3. **Integrate all at once:**
   ```bash
   npm run integrate:scraped
   ```

### Option 3: Alternative WordPress Plugins

If you have WordPress admin access, you could:

1. Install a plugin like "WP REST API Controller" or "Advanced Custom Fields to REST API"
2. Expose Oxygen Builder meta fields through a custom endpoint
3. Re-run the extraction scripts

## 📋 Quick Reference

### Commands:
```bash
# Prepare scraping structure
npm run scrape:oxygen

# After adding HTML files, integrate them
npm run integrate:scraped

# Restart dev server
npm run dev

# Build for production (when scraping complete)
npm run build
```

### File Locations:
- **Scraped HTML**: `data/scraped-html/pages/[slug].html`
- **Page Data**: `data/processed/pages/[slug].json`
- **URL List**: `data/pages-to-scrape.txt`

## 🌐 What's Working Now

Visit these URLs to see the content:

1. **Homepage**: http://localhost:3000
   - ✅ Hero section with eSIM for travel
   - ✅ Popular destinations grid
   - ✅ Benefits section
   - ✅ How it works
   - ✅ Latest blog posts
   - ✅ CTA sections

2. **Egypt Page**: http://localhost:3000/esim-egipet/
   - ✅ Hero with package info
   - ✅ "What is eSIM?" section
   - ✅ Popular plans (7/15/30 days)
   - ✅ Why eSIM is better
   - ✅ Activation steps
   - ✅ CTA sections

## 🎨 Next Steps

### Immediate (Required):
1. ✅ ~~Homepage content~~ - DONE
2. ✅ ~~Egypt page content~~ - DONE
3. ⏳ Scrape top 5 country pages (UK, USA, Turkey, Thailand, Serbia)
4. ⏳ Scrape blog index page
5. ⏳ Scrape top 3 blog posts

### Short-term:
6. Scrape remaining country pages
7. Scrape utility pages (contacts, calculator, compatibility)
8. Scrape remaining blog posts

### Long-term:
9. Refine CSS to match original design exactly
10. Add any missing images
11. Test all links and navigation
12. Build and deploy

## 💡 Tips

### Quick Win Strategy:
Focus on pages users visit most:
1. Homepage ✅
2. Top 3-5 country pages
3. Blog index
4. "What is eSIM?" post

Other pages can be scraped gradually as needed.

### Time Estimate:
- Per page: 2-3 minutes to scrape and integrate
- All 14 pages: ~30-45 minutes
- All 7 blog posts: ~15-20 minutes
- **Total: ~1 hour for complete content migration**

## 🔧 Troubleshooting

### Content Not Showing?
```bash
# 1. Check if HTML file exists
ls data/scraped-html/pages/

# 2. Check if it's a placeholder
cat data/scraped-html/pages/[slug].html

# 3. Re-integrate
npm run integrate:scraped

# 4. Restart server
npm run dev
```

### Still Empty Content?
The HTML file might be a placeholder. Look for:
```html
<!-- TODO: Replace this with actual scraped HTML content -->
```

If you see this, you need to scrape that page and replace the placeholder content.

## 📊 Progress Tracking

**Content Migration Progress: 2/21 (9.5%)**

- Pages: 2/14 complete
- Posts: 0/7 complete

**Time Investment:**
- Already spent: ~10 minutes (2 pages scraped)
- Remaining: ~50 minutes (19 pages + posts)

---

**Your site is running with partial content!**
**Homepage and Egypt page are fully functional.**
**Scrape the remaining pages gradually to complete the migration.**


