# Testing Guide for API Integration

This guide covers how to test the API client improvements, including unit tests, integration tests, and manual testing procedures.

## Table of Contents

1. [Quick Testing Checklist](#quick-testing-checklist)
2. [Manual Testing](#manual-testing)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [Error Scenario Testing](#error-scenario-testing)
6. [Caching Tests](#caching-tests)
7. [Performance Testing](#performance-testing)

## Quick Testing Checklist

- [ ] Test successful API requests
- [ ] Test error handling (404, 500, network errors)
- [ ] Test retry logic
- [ ] Test caching behavior
- [ ] Test request deduplication
- [ ] Test timeout handling
- [ ] Test in both client and server components
- [ ] Test API routes with the new client

## Manual Testing

### 1. Test Basic API Call

**In Browser Console:**

```javascript
// Test basic GET request
fetch('/api/saily-plans?countryCode=US')
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

**Expected Result:**
- Returns plans data with `success: true`
- Response includes `plans` array
- Response includes `lastUpdated` timestamp

### 2. Test Error Handling

**Test 404 Error:**
```javascript
fetch('/api/nonexistent-endpoint')
  .then(res => res.json())
  .then(data => console.log('Response:', data))
  .catch(err => console.error('Error:', err));
```

**Test Invalid Country Code:**
```javascript
fetch('/api/saily-plans?countryCode=INVALID')
  .then(res => res.json())
  .then(data => console.log('Response:', data));
```

### 3. Test Caching

**First Request (should hit API):**
```javascript
console.time('First Request');
fetch('/api/saily-plans?countryCode=US')
  .then(res => res.json())
  .then(data => {
    console.timeEnd('First Request');
    console.log('First request:', data);
  });
```

**Second Request (should use cache):**
```javascript
console.time('Second Request');
fetch('/api/saily-plans?countryCode=US')
  .then(res => res.json())
  .then(data => {
    console.timeEnd('Second Request');
    console.log('Second request (cached):', data);
  });
```

**Expected Result:**
- Second request should be faster
- Both should return same data

### 4. Test in React Component

Create a test component:

```typescript
'use client';

import { useState } from 'react';
import { apiClient, ApiClientError } from '@/lib/api-client';

export function TestComponent() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/api/saily-plans?countryCode=US', {
        cache: true,
        cacheKey: 'test-plans',
      });
      setResult(data);
    } catch (err) {
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
    <div style={{ padding: '20px' }}>
      <button onClick={testApi} disabled={loading}>
        {loading ? 'Loading...' : 'Test API'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {result && (
        <div>
          <h3>Success!</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

## Unit Tests

### Setup Test Environment

First, install testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom @types/jest
```

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

### Test API Client

Create `src/lib/__tests__/api-client.test.ts`:

```typescript
import { ApiClient, ApiClientError } from '../api-client';

// Mock fetch
global.fetch = jest.fn();

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient({
      baseUrl: 'https://api.test.com',
      timeout: 5000,
      retries: 2,
      cache: {
        enabled: true,
        ttl: 1000,
        strategy: 'memory',
      },
    });
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { success: true, data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await client.get('/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Not found' }),
      });

      await expect(client.get('/test')).rejects.toThrow(ApiClientError);
    });

    it('should retry on network errors', async () => {
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

      const result = await client.get('/test');

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should cache responses', async () => {
      const mockData = { success: true, data: 'cached' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      // First request
      const result1 = await client.get('/test', { cache: true });
      // Second request (should use cache)
      const result2 = await client.get('/test', { cache: true });

      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to cache
    });
  });

  describe('Error handling', () => {
    it('should throw ApiClientError for non-OK responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Server error' }),
      });

      try {
        await client.get('/test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).status).toBe(500);
      }
    });
  });

  describe('Timeout handling', () => {
    it('should timeout after specified time', async () => {
      jest.useFakeTimers();
      
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 10000))
      );

      const promise = client.get('/test');
      
      jest.advanceTimersByTime(5000);
      
      await expect(promise).rejects.toThrow();
      
      jest.useRealTimers();
    });
  });
});
```

## Integration Tests

### Test API Route

Create `src/app/api/__tests__/saily-plans.test.ts`:

```typescript
import { NextRequest } from 'next/server';
import { GET } from '../saily-plans-improved/route';

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  ApiClient: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
  })),
  handleApiError: jest.fn(),
}));

describe('/api/saily-plans', () => {
  it('should return plans for valid country code', async () => {
    const mockPlans = {
      items: [
        {
          identifier: 'test-1',
          name: 'Test Plan',
          data_limit: { amount: 5, unit: 'GB', is_unlimited: false },
          duration: { amount: 30, unit: 'day' },
          price: { amount_with_tax: 999, currency: 'USD', identifier: 'price-1' },
          covered_countries: ['US'],
          is_unlimited: false,
        },
      ],
    };

    const { ApiClient } = require('@/lib/api-client');
    const mockClient = new ApiClient();
    mockClient.get = jest.fn().mockResolvedValue(mockPlans);

    const request = new NextRequest('http://localhost:3000/api/saily-plans?countryCode=US');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.plans).toBeDefined();
  });

  it('should handle API errors gracefully', async () => {
    const { ApiClient, ApiClientError } = require('@/lib/api-client');
    const mockClient = new ApiClient();
    mockClient.get = jest.fn().mockRejectedValue(
      new ApiClientError({
        message: 'API Error',
        status: 500,
      })
    );

    const request = new NextRequest('http://localhost:3000/api/saily-plans');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});
```

## Error Scenario Testing

### Test Network Failures

```typescript
// Simulate network failure
global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'));

const client = new ApiClient({ retries: 3 });
await expect(client.get('/test')).rejects.toThrow();
expect(global.fetch).toHaveBeenCalledTimes(3); // Should retry 3 times
```

### Test Server Errors

```typescript
// Test 500 error
global.fetch = jest.fn().mockResolvedValue({
  ok: false,
  status: 500,
  statusText: 'Internal Server Error',
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => ({ error: 'Server error' }),
});

const client = new ApiClient({ retries: 2 });
await expect(client.get('/test')).rejects.toThrow(ApiClientError);
```

### Test Rate Limiting

```typescript
// Test 429 Too Many Requests
global.fetch = jest.fn().mockResolvedValue({
  ok: false,
  status: 429,
  statusText: 'Too Many Requests',
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => ({ error: 'Rate limit exceeded' }),
});

const client = new ApiClient({ retries: 2 });
// Should retry on 429
await expect(client.get('/test')).rejects.toThrow();
expect(global.fetch).toHaveBeenCalledTimes(2);
```

## Caching Tests

### Test Memory Cache

```typescript
const client = new ApiClient({
  cache: {
    enabled: true,
    ttl: 1000,
    strategy: 'memory',
  },
});

// Mock successful response
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' }),
  headers: new Headers({ 'content-type': 'application/json' }),
});

// First request
await client.get('/test');
// Second request (should use cache)
await client.get('/test');

expect(global.fetch).toHaveBeenCalledTimes(1);
```

### Test Cache Expiration

```typescript
const client = new ApiClient({
  cache: {
    enabled: true,
    ttl: 100, // 100ms TTL
    strategy: 'memory',
  },
});

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' }),
  headers: new Headers({ 'content-type': 'application/json' }),
});

// First request
await client.get('/test');
// Wait for cache to expire
await new Promise(resolve => setTimeout(resolve, 150));
// Second request (should fetch again)
await client.get('/test');

expect(global.fetch).toHaveBeenCalledTimes(2);
```

## Performance Testing

### Test Request Deduplication

```typescript
const client = new ApiClient();

global.fetch = jest.fn().mockImplementation(
  () => new Promise(resolve => 
    setTimeout(() => resolve({
      ok: true,
      json: async () => ({ data: 'test' }),
      headers: new Headers({ 'content-type': 'application/json' }),
    }), 100)
  )
);

// Make multiple simultaneous requests
const promises = [
  client.get('/test'),
  client.get('/test'),
  client.get('/test'),
];

await Promise.all(promises);

// Should only make one actual request
expect(global.fetch).toHaveBeenCalledTimes(1);
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test File

```bash
npm test api-client.test.ts
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

## Manual Testing Checklist

### Browser Testing

1. **Open Browser DevTools**
   - Network tab to see requests
   - Console for errors
   - Application tab to check localStorage cache

2. **Test Successful Request**
   ```
   - Navigate to page using API
   - Check Network tab for request
   - Verify response is cached on second load
   ```

3. **Test Error Handling**
   ```
   - Disable network (Offline mode)
   - Try to load data
   - Verify error message is shown
   - Re-enable network
   - Verify retry works
   ```

4. **Test Caching**
   ```
   - Load page first time (check Network tab)
   - Reload page (should use cache, no new request)
   - Clear cache and reload (new request)
   ```

### API Route Testing

Use a tool like Postman or curl:

```bash
# Test successful request
curl http://localhost:3000/api/saily-plans?countryCode=US

# Test error handling
curl http://localhost:3000/api/nonexistent-endpoint

# Test with invalid data
curl http://localhost:3000/api/saily-plans?countryCode=INVALID
```

## Testing Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:api": "jest --testPathPattern=api"
  }
}
```

## Next Steps

1. Set up Jest configuration
2. Write unit tests for API client
3. Write integration tests for API routes
4. Test error scenarios manually
5. Verify caching behavior
6. Test performance improvements

