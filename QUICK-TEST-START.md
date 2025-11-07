# Quick Start: Testing the API Improvements

This is a quick guide to test the API integration improvements without setting up the full test suite.

## Option 1: Manual Testing (Easiest - No Setup Required)

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Open the Manual Testing Tool

1. Open `test-api-manual.html` in your browser
2. Or navigate to `http://localhost:3001/test-api-manual.html` if you serve it

### Step 3: Test Basic Functionality

Click the buttons to test:
- **Test Basic Request** - Tests successful API call
- **Test with Country Code** - Tests filtering
- **Test Caching** - Tests cache performance
- **Test Request Deduplication** - Tests simultaneous requests

### Step 4: Check Browser Console

Open DevTools (F12) and check:
- **Network tab** - See actual requests
- **Console tab** - See any errors
- **Application tab** - Check localStorage cache (if using localStorage strategy)

## Option 2: Browser Console Testing

### Test in Browser Console

1. Open your app in browser
2. Open DevTools Console (F12)
3. Run these commands:

```javascript
// Test basic request
fetch('/api/saily-plans?countryCode=US')
  .then(res => res.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));

// Test caching (run twice, second should be faster)
console.time('Request 1');
fetch('/api/saily-plans?countryCode=US')
  .then(res => res.json())
  .then(data => {
    console.timeEnd('Request 1');
    console.log('Data:', data);
  });

// Wait a moment, then run again
setTimeout(() => {
  console.time('Request 2');
  fetch('/api/saily-plans?countryCode=US')
    .then(res => res.json())
    .then(data => {
      console.timeEnd('Request 2');
      console.log('Cached data:', data);
    });
}, 1000);
```

## Option 3: Create a Test Component

### Create Test Component

Create `src/components/test/TestApiClient.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { apiClient, ApiClientError } from '@/lib/api-client';

export function TestApiClient() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    const startTime = performance.now();
    
    try {
      const data = await apiClient.get('/api/saily-plans?countryCode=US', {
        cache: true,
        cacheKey: 'test-plans',
      });
      
      const endTime = performance.now();
      setDuration(endTime - startTime);
      setResult(data);
    } catch (err) {
      const endTime = performance.now();
      setDuration(endTime - startTime);
      
      if (err instanceof ApiClientError) {
        setError(`Error ${err.status}: ${err.message}`);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px' }}>
      <h2>API Client Test</h2>
      <button 
        onClick={testApi} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Test API'}
      </button>
      
      {duration && (
        <p>Duration: {duration.toFixed(2)}ms</p>
      )}
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '10px' }}>
          <strong>Success!</strong>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

### Add to a Page

Add to any page (e.g., `src/app/test/page.tsx`):

```typescript
import { TestApiClient } from '@/components/test/TestApiClient';

export default function TestPage() {
  return (
    <div>
      <h1>API Testing Page</h1>
      <TestApiClient />
    </div>
  );
}
```

Then visit `http://localhost:3001/test`

## Option 4: Use curl or Postman

### Test with curl

```bash
# Test successful request
curl http://localhost:3001/api/saily-plans?countryCode=US

# Test with different country
curl http://localhost:3001/api/saily-plans?countryCode=GB

# Test error handling
curl http://localhost:3001/api/nonexistent-endpoint
```

### Test with Postman

1. Create a new GET request
2. URL: `http://localhost:3001/api/saily-plans?countryCode=US`
3. Send request
4. Check response time and data

## What to Look For

### ✅ Success Indicators

1. **Fast Response Times**
   - First request: ~200-500ms (depending on API)
   - Cached request: <50ms

2. **Consistent Responses**
   - Same data structure
   - Proper error handling

3. **No Console Errors**
   - Check browser console
   - Check server logs

4. **Proper Caching**
   - Second request is faster
   - Network tab shows cached requests

### ❌ Issues to Watch For

1. **Slow Responses**
   - Check if retry logic is working
   - Check if caching is enabled

2. **Errors**
   - Check error messages
   - Verify API endpoints are correct

3. **Cache Not Working**
   - Check cache configuration
   - Verify cache keys are consistent

## Quick Test Checklist

- [ ] Basic GET request works
- [ ] Error handling works (try invalid endpoint)
- [ ] Caching works (second request is faster)
- [ ] Different country codes work
- [ ] No console errors
- [ ] Response times are reasonable

## Next Steps

Once manual testing passes:

1. Set up Jest for automated tests (see `TESTING-GUIDE.md`)
2. Write unit tests for API client
3. Write integration tests for API routes
4. Add to CI/CD pipeline

## Troubleshooting

### API Not Responding

- Check if dev server is running
- Check if API route exists
- Check browser console for errors

### Cache Not Working

- Verify cache is enabled in client config
- Check if cache key is consistent
- Clear browser cache and try again

### Slow Performance

- Check network tab for actual request times
- Verify retry logic isn't causing delays
- Check if external API is slow

## Need Help?

- Check `TESTING-GUIDE.md` for detailed testing procedures
- Review `API-BEST-PRACTICES.md` for usage patterns
- Check `src/lib/api-client-examples.ts` for code examples

