/**
 * Examples of using the API Client
 * 
 * This file demonstrates best practices for API integration in Next.js
 */

import { apiClient, ApiClientError } from './api-client';

// ============================================
// Example 1: Basic GET request with caching
// ============================================
export async function fetchPlans(countryCode?: string) {
  try {
    const url = countryCode 
      ? `/api/saily-plans?countryCode=${countryCode}`
      : '/api/saily-plans';
    
    const data = await apiClient.get<{
      success: boolean;
      plans: any[];
      lastUpdated?: string;
    }>(url, {
      cache: true, // Enable caching (default)
      cacheKey: `plans-${countryCode || 'all'}`, // Custom cache key
    });

    return data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error('API Error:', error.message, error.status);
      // Handle specific error cases
      if (error.status === 404) {
        // Handle not found
      } else if (error.status === 429) {
        // Handle rate limiting
      }
    }
    throw error;
  }
}

// ============================================
// Example 2: POST request with error handling
// ============================================
export async function createOrder(orderData: {
  planId: string;
  quantity: number;
}) {
  try {
    const response = await apiClient.post<{
      success: boolean;
      orderId: string;
    }>('/api/orders', orderData);

    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // Log error details
      console.error('Order creation failed:', {
        message: error.message,
        status: error.status,
        data: error.data,
      });

      // Return user-friendly error
      throw new Error('Failed to create order. Please try again.');
    }
    throw error;
  }
}

// ============================================
// Example 3: Using in React components (Client-side)
// ============================================
/*
'use client';

import { useState, useEffect } from 'react';
import { fetchPlans } from '@/lib/api-client-examples';
import { ApiClientError } from '@/lib/api-client';

export function PlansList({ countryCode }: { countryCode: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchPlans(countryCode);
        
        if (data.success && data.plans) {
          setPlans(data.plans);
        } else {
          setError('No plans available');
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
*/

// ============================================
// Example 4: Using in Server Components (Next.js 14)
// ============================================
/*
import { fetchPlans } from '@/lib/api-client-examples';

export default async function PlansPage({ 
  params 
}: { 
  params: { countryCode: string } 
}) {
  try {
    const data = await fetchPlans(params.countryCode);
    
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
*/

// ============================================
// Example 5: Using in API Routes (Server-side)
// ============================================
/*
import { NextRequest, NextResponse } from 'next/server';
import { apiClient, handleApiError } from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');

    // Fetch from external API
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
*/

// ============================================
// Example 6: Custom API client instance
// ============================================
/*
import { ApiClient } from '@/lib/api-client';

// Create a custom client for a specific API
const externalApiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 10000, // 10 seconds
  retries: 2,
  cache: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes
    strategy: 'localStorage', // Use localStorage for client-side
  },
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  },
});

export async function fetchExternalData() {
  return externalApiClient.get('/data');
}
*/

// ============================================
// Example 7: Cache management
// ============================================
/*
import { apiClient } from '@/lib/api-client';

// Clear all cache
apiClient.clearCache();

// Clear specific cache entry
apiClient.clearCacheEntry('plans-US');

// Disable cache for a specific request
const data = await apiClient.get('/api/data', {
  cache: false,
});
*/

