# API Integration Best Practices for Next.js

This guide covers best practices for API integration with error handling and caching in Next.js 14.

## Table of Contents

1. [Overview](#overview)
2. [API Client Features](#api-client-features)
3. [Error Handling](#error-handling)
4. [Caching Strategies](#caching-strategies)
5. [Usage Examples](#usage-examples)
6. [Server vs Client Components](#server-vs-client-components)
7. [API Routes Best Practices](#api-routes-best-practices)
8. [Performance Optimization](#performance-optimization)

## Overview

The `ApiClient` class provides a robust solution for API integration with:

- ✅ Automatic retry with exponential backoff
- ✅ Request/response caching (memory or localStorage)
- ✅ Request deduplication
- ✅ Timeout handling
- ✅ Type-safe error handling
- ✅ Network error recovery

## API Client Features

### 1. Automatic Retry

The client automatically retries failed requests with exponential backoff:

```typescript
const apiClient = new ApiClient({
  retries: 3,        // Retry up to 3 times
  retryDelay: 1000,  // Base delay: 1 second
});

// Retry delays: 1s, 2s, 4s (exponential backoff)
```

**Retryable errors:**
- Network errors (connection failures)
- 5xx server errors
- 429 Too Many Requests
- Timeout errors

### 2. Caching

Two caching strategies available:

#### Memory Cache (Default)
- Fast, in-memory storage
- Works on both server and client
- Cleared on page refresh

```typescript
const apiClient = new ApiClient({
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    strategy: 'memory',
  },
});
```

#### LocalStorage Cache
- Persists across page refreshes
- Client-side only
- Useful for frequently accessed data

```typescript
const apiClient = new ApiClient({
  cache: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes
    strategy: 'localStorage',
  },
});
```

### 3. Request Deduplication

Prevents multiple identical requests from executing simultaneously:

```typescript
// If multiple components request the same data,
// only one request is made
const data1 = await apiClient.get('/api/plans');
const data2 = await apiClient.get('/api/plans'); // Uses cached result
```

### 4. Timeout Handling

Prevents hanging requests:

```typescript
const apiClient = new ApiClient({
  timeout: 30000, // 30 seconds
});
```

## Error Handling

### Type-Safe Error Handling

```typescript
import { ApiClientError } from '@/lib/api-client';

try {
  const data = await apiClient.get('/api/plans');
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Data:', error.data);
    
    // Handle specific status codes
    if (error.status === 404) {
      // Not found
    } else if (error.status === 429) {
      // Rate limited
    } else if (error.status >= 500) {
      // Server error
    }
  }
}
```

### Error Response Format

```typescript
interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
  code?: string;
}
```

## Caching Strategies

### When to Use Caching

✅ **Cache these:**
- Static or semi-static data (plans, products, countries)
- Data that changes infrequently
- Expensive API calls
- Data needed across multiple components

❌ **Don't cache these:**
- User-specific data
- Real-time data
- POST/PUT/DELETE requests
- Sensitive information

### Cache Invalidation

```typescript
// Clear all cache
apiClient.clearCache();

// Clear specific entry
apiClient.clearCacheEntry('plans-US');

// Disable cache for specific request
const data = await apiClient.get('/api/data', {
  cache: false,
});
```

## Usage Examples

### Client Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient, ApiClientError } from '@/lib/api-client';

export function PlansList({ countryCode }: { countryCode: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiClient.get<{
          success: boolean;
          plans: any[];
        }>(`/api/saily-plans?countryCode=${countryCode}`, {
          cache: true,
          cacheKey: `plans-${countryCode}`,
        });
        
        if (data.success && data.plans) {
          setPlans(data.plans);
        }
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to load plans');
        }
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, [countryCode]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>{plan.name}</div>
      ))}
    </div>
  );
}
```

### Server Component (Next.js 14)

```typescript
import { apiClient } from '@/lib/api-client';

export default async function PlansPage({ 
  params 
}: { 
  params: { countryCode: string } 
}) {
  try {
    const data = await apiClient.get<{
      success: boolean;
      plans: any[];
    }>(`/api/saily-plans?countryCode=${params.countryCode}`);
    
    if (!data.success || !data.plans.length) {
      return <div>No plans available</div>;
    }

    return (
      <div>
        {data.plans.map(plan => (
          <div key={plan.id}>{plan.name}</div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Failed to load plans:', error);
    return <div>Failed to load plans</div>;
  }
}
```

### API Route (Server-side)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { apiClient, handleApiError } from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');

    // Fetch from external API with retry and error handling
    const data = await apiClient.get('https://external-api.com/plans', {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Server vs Client Components

### When to Use Server Components

✅ **Use Server Components for:**
- Initial page load data
- SEO-critical content
- Data that doesn't need real-time updates
- Reducing client-side JavaScript

```typescript
// Server Component - data fetched at build/request time
export default async function Page() {
  const data = await apiClient.get('/api/data');
  return <div>{data.content}</div>;
}
```

### When to Use Client Components

✅ **Use Client Components for:**
- Interactive features
- Real-time data updates
- User-specific data
- Data that changes based on user actions

```typescript
'use client';

// Client Component - data fetched on client
export function InteractiveComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    apiClient.get('/api/data').then(setData);
  }, []);
  
  return <div>{data?.content}</div>;
}
```

## API Routes Best Practices

### 1. Error Handling

Always use proper error handling:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 2. Input Validation

Validate and sanitize inputs:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }
    
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 3. Rate Limiting

Consider implementing rate limiting for public APIs:

```typescript
// Example with simple in-memory rate limiting
const rateLimitMap = new Map();

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const key = `rate_limit_${ip}`;
  const now = Date.now();
  
  const requests = rateLimitMap.get(key) || [];
  const recentRequests = requests.filter((time: number) => now - time < 60000);
  
  if (recentRequests.length >= 100) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);
  
  // Continue with request
}
```

### 4. Caching Headers

Set appropriate cache headers:

```typescript
export async function GET(request: NextRequest) {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

## Performance Optimization

### 1. Request Deduplication

The API client automatically deduplicates identical requests:

```typescript
// Multiple components requesting same data
// Only one request is made
const Component1 = () => {
  const data = await apiClient.get('/api/plans');
};

const Component2 = () => {
  const data = await apiClient.get('/api/plans'); // Uses cached result
};
```

### 2. Parallel Requests

Use `Promise.all` for independent requests:

```typescript
const [plans, countries, currencies] = await Promise.all([
  apiClient.get('/api/plans'),
  apiClient.get('/api/countries'),
  apiClient.get('/api/currencies'),
]);
```

### 3. Selective Caching

Cache only what makes sense:

```typescript
// Cache static data
const countries = await apiClient.get('/api/countries', { cache: true });

// Don't cache user-specific data
const userProfile = await apiClient.get('/api/user/profile', { cache: false });
```

### 4. Next.js Caching

Use Next.js built-in caching for API routes:

```typescript
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const data = await fetchData();
  return NextResponse.json(data);
}
```

## Best Practices Summary

1. ✅ **Always handle errors** - Use try/catch and check error types
2. ✅ **Use appropriate caching** - Cache static data, not user-specific data
3. ✅ **Set timeouts** - Prevent hanging requests
4. ✅ **Validate inputs** - Check and sanitize all inputs
5. ✅ **Use TypeScript** - Type your API responses
6. ✅ **Log errors** - Log errors for debugging (but not sensitive data)
7. ✅ **Return consistent responses** - Use consistent response format
8. ✅ **Handle edge cases** - Network failures, timeouts, invalid responses
9. ✅ **Use Server Components when possible** - Better performance and SEO
10. ✅ **Implement rate limiting** - Protect your APIs from abuse

## Migration Guide

To migrate existing code to use the new API client:

1. Replace direct `fetch` calls with `apiClient.get/post/etc`
2. Wrap in try/catch with `ApiClientError` handling
3. Add caching where appropriate
4. Update error handling to use the new error format

Example migration:

```typescript
// Before
const response = await fetch('/api/plans');
const data = await response.json();

// After
try {
  const data = await apiClient.get('/api/plans', {
    cache: true,
    cacheKey: 'plans',
  });
} catch (error) {
  if (error instanceof ApiClientError) {
    // Handle error
  }
}
```

