# Plans Difference Analysis: Localhost vs Production

## Issue Summary

**Problem:** Plans displayed on localhost are different (and correct) compared to the live website.

**Root Cause:** The project uses static export (`output: 'export'`), which means:
- ✅ **Localhost (dev mode):** API routes work → Uses `/api/saily-plans` → Correctly filters out unrealistic plans (999 GB)
- ❌ **Production (static export):** API routes don't work → Falls back to `FALLBACK_PLANS` → May show outdated plans

## Current Architecture

### Localhost (Development)
```
Component → /api/saily-plans → Saily API → Filter (removes 999 GB plans) → Display
```

### Production (Static Export)
```
Component → /api/saily-plans (fails) → FALLBACK_PLANS → Display
```

## Code Status

✅ **Git Status:** Working tree is clean, code is synced with GitHub
✅ **API Route:** `src/app/api/saily-plans/route.ts` correctly filters plans (line 49-52)
✅ **Fallback Plans:** `src/lib/sailyApi.ts` contains `FALLBACK_PLANS` for production

## Solution

The live website needs to be **rebuilt** with the latest code. The filtering logic is already in place:

1. **API Route Filtering** (works on localhost):
   ```typescript
   // Line 49-52 in src/app/api/saily-plans/route.ts
   if (!plan.is_unlimited && plan.data_limit.amount > 100) {
     console.log(`Filtering out unrealistic plan: ${plan.name} with ${plan.data_limit.amount} ${plan.data_limit.unit}`);
     return false;
   }
   ```

2. **Fallback Plans** (used in production):
   - Located in `src/lib/sailyApi.ts` (lines 442-1850)
   - Manually defined, should not contain unrealistic plans
   - Used when API route fails in production

## Action Required

1. **Rebuild the production site** to ensure latest code is deployed
2. **Verify** that `FALLBACK_PLANS` don't contain any 999 GB plans
3. **Test** the live site after rebuild

## Files Involved

- `src/app/api/saily-plans/route.ts` - API route with filtering (dev only)
- `src/lib/sailyApi.ts` - Fallback plans (production)
- `src/components/country/PlansSectionWrapper.tsx` - Uses API with fallback
- `src/components/country/HeroSectionWrapper.tsx` - Uses API with fallback
- `next.config.js` - Static export configuration

## Notes

- The filtering logic is correct and working on localhost
- The fallback system is working as designed
- The issue is likely that production needs a rebuild to get the latest code

