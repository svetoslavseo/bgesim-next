# Performance Optimization Plan - Slow 4G Mobile Testing

## Date: November 7, 2025
## Test Environment: Slow 4G, Mobile (375x667), 4x CPU throttling

---

## 📊 Test Results Summary

### Blog Article Page (`/blog/rouming-v-syrbia-ceni-paketi-esim-alternativi/`)

**Core Web Vitals:**
- ✅ CLS: 0.00 (Perfect - no layout shifts)
- ⚠️ LCP: Not captured (needs retest)
- ⚠️ FID: Not captured (needs retest)

**Performance Issues Found:**
1. **Third-Party Scripts**: 
   - Google Tag Manager: 747 kB transfer, 261 ms main thread time
   - Google Analytics: 20 B transfer
   - Impact: Significant on Slow 4G

2. **Image Optimization**:
   - Some images not using Next.js Image component (`vasil-andreev-150x150.jpeg`)
   - Images are cached (304 responses) ✅

### Country Page (`/esim-egipet/`)

**Core Web Vitals:**
- ✅ CLS: 0.00 (Perfect - no layout shifts)
- ⚠️ LCP: Not captured (needs retest)
- ⚠️ FID: Not captured (needs retest)

**Performance Issues Found:**
1. **DOM Size**:
   - 680 elements affected in style recalculation
   - Style recalculation: 67 ms duration
   - Impact: Slower rendering on mobile

2. **Forced Reflow**:
   - 39 ms total reflow time
   - Caused by Next.js Image component layout calculations
   - Impact: Layout thrashing

3. **Third-Party Scripts**:
   - Same GTM/GA impact as blog page

---

## 🎯 Optimization Targets (CWV Requirements)

### Core Web Vitals Targets:
- **LCP (Largest Contentful Paint)**: < 2.5s (Good), < 1.8s (Excellent)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good), < 0.05 (Excellent) ✅ Already achieved
- **FID (First Input Delay)**: < 100ms (Good), < 50ms (Excellent)
- **FCP (First Contentful Paint)**: < 1.8s (Good), < 1.2s (Excellent)

---

## 🔧 Optimization Strategy

### Priority 1: Third-Party Script Optimization
**Impact**: High (747 kB, 261 ms main thread)
**Target**: Reduce GTM/GA impact by 50-70%

1. **Defer GTM/GA Loading**:
   - Use `lazyOnload` strategy instead of `afterInteractive`
   - Load only after page is fully interactive
   - Use Partytown for web workers (optional, advanced)

2. **Conditional Loading**:
   - Only load analytics after user interaction
   - Use consent-based loading

### Priority 2: Image Optimization
**Impact**: Medium-High (Forced reflows, non-optimized images)
**Target**: Eliminate forced reflows, optimize all images

1. **Convert all images to Next.js Image**:
   - Replace `<img>` tags with `<Image>` component
   - Add proper `width` and `height` attributes
   - Use `loading="lazy"` for below-fold images

2. **Optimize Image Loading**:
   - Add `priority` only to LCP images
   - Use `placeholder="blur"` with proper blur data URLs
   - Implement responsive `sizes` attribute

3. **Preload Critical Images**:
   - Preload LCP image in `<head>`
   - Use resource hints (`rel="preload"`)

### Priority 3: DOM Size Optimization
**Impact**: Medium (680 elements, 67 ms style recalculation)
**Target**: Reduce DOM complexity by 20-30%

1. **Component Optimization**:
   - Split large components into smaller ones
   - Use CSS containment for isolated sections
   - Implement virtual scrolling for long lists (if applicable)

2. **CSS Optimization**:
   - Reduce CSS specificity
   - Use CSS containment (`contain: layout style paint`)
   - Minimize style recalculations

### Priority 4: Resource Hints & Preloading
**Impact**: Medium (Faster resource discovery)
**Target**: Improve resource loading priority

1. **DNS Prefetch**:
   - Add for third-party domains (already done ✅)

2. **Preconnect**:
   - Add for critical third-party resources
   - Use `crossorigin` attribute where needed

3. **Preload**:
   - Preload critical CSS
   - Preload LCP image
   - Preload critical fonts

---

## 📋 Implementation Checklist

### Phase 1: Third-Party Scripts (High Priority)
- [ ] Change GTM strategy to `lazyOnload`
- [ ] Change GA strategy to `lazyOnload`
- [ ] Add conditional loading based on user consent
- [ ] Test impact on Slow 4G

### Phase 2: Image Optimization (High Priority)
- [ ] Convert `vasil-andreev-150x150.jpeg` to Next.js Image
- [ ] Add proper dimensions to all images
- [ ] Implement blur placeholders for all images
- [ ] Preload LCP image
- [ ] Optimize image `sizes` attributes

### Phase 3: DOM Optimization (Medium Priority)
- [ ] Add CSS containment to large sections
- [ ] Optimize component structure
- [ ] Reduce unnecessary DOM elements
- [ ] Test style recalculation time

### Phase 4: Resource Hints (Medium Priority)
- [ ] Add preload for LCP image
- [ ] Add preload for critical CSS
- [ ] Optimize preconnect usage
- [ ] Test resource loading priority

---

## 🧪 Testing Plan

### After Each Phase:
1. Run performance trace on Slow 4G mobile
2. Measure Core Web Vitals:
   - LCP
   - CLS (should remain 0.00)
   - FID
   - FCP
3. Check network requests
4. Verify no regressions

### Success Criteria:
- ✅ LCP < 2.5s on Slow 4G
- ✅ CLS < 0.1 (already achieved)
- ✅ FID < 100ms
- ✅ FCP < 1.8s
- ✅ Third-party script impact reduced by 50%+

---

## 📈 Expected Improvements

### After All Optimizations:
- **LCP**: 30-50% improvement (from ~3-4s to ~1.5-2.5s)
- **FCP**: 20-30% improvement
- **FID**: 40-60% improvement (reduced main thread blocking)
- **Bundle Size**: 15-25% reduction (already optimized)
- **Third-Party Impact**: 50-70% reduction

---

*Plan created based on Chrome DevTools MCP performance analysis*

