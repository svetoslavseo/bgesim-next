# How to Verify GTM Data is Going to Correct GA4 Property

## Method 1: Google Tag Manager Preview Mode (Easiest)

### Steps:
1. Open GTM Preview mode and connect to your site
2. Click on your checkout button
3. In GTM Preview, check the **"GA4 - Checkout Continue Click"** tag
4. Look for **"Tags Fired"** section
5. Click on the tag to see details
6. Check the **"HTTP Request"** or **"API Call"** section
7. Look for the Measurement ID in the request URL: `tid=G-J85XGQ483H`

**What to look for:**
- Tag status should be "Fired" (not "Failed")
- In the tag details, you should see the Measurement ID: `G-J85XGQ483H`
- The request URL should contain `tid=G-J85XGQ483H`

## Method 2: GA4 DebugView (Most Reliable)

### Enable Debug Mode:

**Option A: Via URL Parameter (Easiest)**
- Add `?debug_mode=1` to your site URL
- Example: `http://localhost:3001/?debug_mode=1`

**Option B: Via Browser Extension**
- Install "Google Analytics Debugger" Chrome extension
- Enable it while browsing your site

**Option C: Via GTM Preview Mode**
- GTM Preview mode automatically enables debug mode

### Steps:
1. Enable debug mode using one of the methods above
2. Go to GA4 → **Admin** → **DebugView**
3. Trigger your event (click checkout button)
4. You should see events appearing in real-time
5. Click on an event to see details
6. Verify:
   - **Measurement ID**: Should show `G-J85XGQ483H`
   - **Event name**: Should show `checkout_continue_click`
   - **Event parameters**: Should show your custom parameters (variant, page_path, etc.)

## Method 3: Browser Network Tab (Technical)

### Steps:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by: `collect` or `google-analytics`
4. Click your checkout button
5. Look for requests to `google-analytics.com/g/collect` or `region1.google-analytics.com/g/collect`
6. Click on the request
7. Check the **Payload** or **Query String Parameters**
8. Look for `tid` parameter - should be `G-J85XGQ483H`

**Example request URL:**
```
https://region1.google-analytics.com/g/collect?
  v=2&
  tid=G-J85XGQ483H&  ← This should match your GA4 property
  en=checkout_continue_click&
  ...
```

## Method 4: GA4 Real-Time Reports

### Steps:
1. Go to GA4 → **Reports** → **Realtime**
2. Trigger your event (click checkout button)
3. Look at **Event count by Event name**
4. You should see `checkout_continue_click` appear
5. Click on it to see event details
6. Verify the data matches what you're sending

**Note:** Real-time reports have a delay of a few seconds

## Method 5: Browser Console (For Developers)

### Steps:
1. Open browser console (F12)
2. Add this code to check dataLayer:
```javascript
// Check what's in dataLayer
console.log('DataLayer:', window.dataLayer);

// Check GA4 configuration
console.log('GA4 Config:', window.google_tag_manager);
```

3. Monitor dataLayer pushes:
```javascript
// Intercept dataLayer pushes
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('[GTM] DataLayer push:', args);
  return originalPush.apply(this, args);
};
```

4. Check GA4 requests:
```javascript
// Check if gtag is configured correctly
if (window.gtag) {
  console.log('gtag function exists');
  // Test push
  window.gtag('event', 'test_event', {
    test_param: 'test_value'
  });
}
```

## Method 6: Verify GTM Tag Configuration

### In GTM:
1. Go to **Tags** → **GA4 - Checkout Continue Click**
2. Check **Configuration Tag**:
   - Should reference your GA4 Configuration tag
   - OR Measurement ID should be `G-J85XGQ483H`
3. Check **Event Name**:
   - Should be `checkout_continue_click`
4. Check **Trigger**:
   - Should be your custom event trigger

## Quick Verification Checklist

- [ ] GTM Preview shows tag firing
- [ ] Tag details show Measurement ID: `G-J85XGQ483H`
- [ ] Network tab shows requests with `tid=G-J85XGQ483H`
- [ ] GA4 DebugView shows events with correct Measurement ID
- [ ] GA4 Real-time reports show `checkout_continue_click` events
- [ ] Event parameters match what you're sending

## Common Issues

### Issue: Wrong Measurement ID
**Symptom:** Requests show different Measurement ID
**Fix:** Update GTM tag's Measurement ID field

### Issue: Events not appearing in GA4
**Symptom:** GTM shows "Fired" but GA4 doesn't receive
**Fix:** 
- Check consent mode settings
- Verify Measurement ID is correct
- Check GA4 DebugView for errors

### Issue: Event name mismatch
**Symptom:** Events appear but with wrong name
**Fix:** Ensure GTM tag's Event Name matches dataLayer event name

## Testing Workflow

1. **Enable Debug Mode**: Add `?debug_mode=1` to URL
2. **Open GTM Preview**: Connect to your site
3. **Open GA4 DebugView**: Keep it open in another tab
4. **Trigger Event**: Click checkout button
5. **Verify in GTM**: Tag should fire
6. **Verify in GA4 DebugView**: Event should appear
7. **Check Network**: Verify Measurement ID in request
8. **Check Real-time**: Verify event appears in GA4 reports

## Expected Results

When everything is working correctly:

✅ **GTM Preview:**
- Tag shows "Fired"
- Tag details show Measurement ID: `G-J85XGQ483H`
- No error messages

✅ **GA4 DebugView:**
- Event `checkout_continue_click` appears
- Measurement ID shows `G-J85XGQ483H`
- Event parameters are present (variant, page_path, etc.)

✅ **Network Tab:**
- Request to `google-analytics.com/g/collect`
- Parameter `tid=G-J85XGQ483H`
- Parameter `en=checkout_continue_click`

✅ **GA4 Real-time:**
- Event appears within 10-30 seconds
- Event count increases
- Event details show correct parameters

