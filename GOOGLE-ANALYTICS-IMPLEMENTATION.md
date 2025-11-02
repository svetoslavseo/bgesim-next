# Google Analytics Implementation - Best Practices

## Overview

This document outlines the Google Analytics (GA) implementation using Next.js best practices, including proper consent mode handling, caching strategies, and cookie management.

## Implementation Details

### Architecture

1. **Consent Mode v2** - Loads first in `<head>` to set default deny permissions
2. **GoogleAnalytics Component** - Uses Next.js `Script` component with `afterInteractive` strategy
3. **Cookie Consent Integration** - Updates consent mode when user grants permissions

### File Structure

```
src/
├── components/
│   └── analytics/
│       └── GoogleAnalytics.tsx    # Main GA component
├── components/
│   └── common/
│       └── CookieBanner.tsx       # Cookie consent UI
├── lib/
│   └── ga.ts                      # GA utility functions
├── types/
│   └── global.d.ts               # TypeScript definitions for gtag
└── app/
    └── layout.tsx                 # Root layout with GA integration
```

## Key Components

### 1. GoogleAnalytics Component (`src/components/analytics/GoogleAnalytics.tsx`)

- Uses Next.js `Script` component with `afterInteractive` strategy
- Works reliably with static export (`output: 'export'`)
- Non-blocking script loading for better performance
- Disables automatic `send_page_view` to handle manually via consent

**Loading Strategy:**
- `afterInteractive`: Scripts load after the page becomes interactive, ensuring non-blocking behavior
- This is optimal for static export and provides better performance than blocking scripts

### 2. Consent Mode Setup (`src/app/layout.tsx`)

- Consent mode script loads in `<head>` before any GA scripts
- Sets default deny state for all consent types except `security_storage`
- Ensures compliance with GDPR and privacy regulations

**Default Consent State:**
```javascript
{
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  ad_storage: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  security_storage: 'granted'  // Always granted for security
}
```

### 3. Cookie Consent Banner (`src/components/common/CookieBanner.tsx`)

- Updates consent mode when user grants permissions
- Stores consent preferences in localStorage
- Fires page view event immediately after analytics consent granted
- 30-day expiration for consent

## Best Practices

### 1. Script Loading Order

**Critical:** Consent mode MUST load before gtag.js:

1. ✅ Consent mode script (inline in `<head>`)
2. ✅ DNS prefetch/preconnect for Google Tag Manager
3. ✅ gtag.js base script (via Script component)
4. ✅ gtag.js configuration (via Script component)

### 2. Next.js Script Component Strategy

**For Static Export:**
- Use `afterInteractive` strategy (works reliably with static export)
- Avoids blocking render
- Better performance than `beforeInteractive` for static sites

**Script Loading Flow:**
```
Page Load → Consent Mode (head) → Page Interactive → GA Scripts Load
```

### 3. Cookie Implementation

**Storage:**
- Uses `localStorage` with key `cookie-consent-v1`
- Stores: `{ analytics: boolean, marketing: boolean, ts: number }`
- 30-day expiration window

**Consent Updates:**
- When user grants consent, updates GA consent mode via `gtag('consent', 'update', {...})`
- Immediately fires page view after analytics consent granted

### 4. Performance Optimizations

**DNS Prefetch/Preconnect:**
```html
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
```

**Script Attributes:**
- GA base script: No `defer` or `async` needed (handled by Script component)
- Script component automatically optimizes loading

### 5. TypeScript Support

Type definitions in `src/types/global.d.ts`:
- `window.dataLayer` - DataLayer array
- `window.gtag` - gtag function with proper signatures

### 6. Debug Mode

Enable debug mode by adding query parameters:
- `?debug_ga=1`
- `?debug_mode=1`

Or when running on `localhost`

## Caching Strategy

### Static Export Considerations

Since we're using `output: 'export'`:

1. **Scripts are bundled at build time** - Script component generates proper script tags
2. **Browser caching** - Let browser handle GA script caching (Google serves with proper cache headers)
3. **No server-side caching needed** - Static files are served as-is

### Cache Headers (if using a server)

If deploying to a server that allows header configuration:

```
# Google Tag Manager scripts
https://www.googletagmanager.com/gtag/js?id=* → Cache: public, max-age=3600

# Our static assets
/_next/static/* → Cache: public, max-age=31536000, immutable
```

## Troubleshooting

### Google Tag Assistant Shows "No Google tags found"

**Possible Causes:**
1. Scripts not loading in correct order
2. Consent mode blocking script execution
3. Static export not generating scripts correctly

**Solutions:**
- Verify consent mode script loads first (check Network tab)
- Ensure `GoogleAnalytics` component is in `<body>` (not `<head>`)
- Check that scripts appear in page source after build
- Verify `afterInteractive` strategy works with your deployment

### gtag.js Not Found on First Load

**Common Issues:**
1. Static export not including Script component output
2. Scripts loading too late
3. CSP blocking scripts

**Solutions:**
- Build and inspect `out/` directory to verify scripts are included
- Check browser console for errors
- Verify CSP headers allow Google Tag Manager

### Consent Not Updating

**Check:**
1. CookieBanner component is rendered
2. `window.gtag` exists when consent updates
3. localStorage is accessible
4. Consent update function is called

## Testing

### Manual Testing Checklist

- [ ] Initial page load shows consent mode in Network tab
- [ ] gtag.js loads after page interactive
- [ ] Google Tag Assistant detects GA tag
- [ ] Cookie banner appears for new visitors
- [ ] Granting consent updates consent mode
- [ ] Page view fires after analytics consent granted
- [ ] Consent persists across page navigations
- [ ] Debug mode works with query parameters

### Automated Testing

Consider adding:
- E2E tests for consent flow
- Unit tests for GA utility functions
- Integration tests for Script component loading

## Compliance

### GDPR Compliance

- ✅ Consent mode v2 implemented
- ✅ Default deny state
- ✅ User consent required before analytics
- ✅ Consent can be revoked
- ✅ Cookie banner with clear options

### Privacy Regulations

- Consent stored locally (no server tracking)
- Clear distinction between analytics and marketing cookies
- User can deny all cookies

## Future Improvements

1. **Server-Side Consent API** - Store consent server-side if needed
2. **Consent Logging** - Log consent decisions for compliance
3. **A/B Testing** - Test consent banner variations
4. **Analytics on Server** - Consider server-side GA for critical events

## References

- [Next.js Script Component](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)
- [Google Consent Mode v2](https://developers.google.com/tag-platform/devguides/consent)
- [Google Analytics gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs)

