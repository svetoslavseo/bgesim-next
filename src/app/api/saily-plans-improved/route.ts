/**
 * Improved API Route using ApiClient
 * 
 * This is an example of how to refactor the existing route to use
 * the new API client with better error handling and caching.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiClient, handleApiError, ApiClientError } from '@/lib/api-client';

// Force dynamic rendering for API route
export const dynamic = 'force-dynamic';

const API_KEY = process.env.SAILY_API_KEY || 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = process.env.SAILY_PARTNER_ID || 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

// Create API URL with utm_source parameter
const apiUrlWithParams = (() => {
  const url = new URL(API_URL);
  url.searchParams.set('utm_source', 'travelesim');
  return url.toString();
})();

// Create a dedicated client for Saily API
const sailyApiClient = new ApiClient({
  baseUrl: apiUrlWithParams,
  timeout: 15000, // 15 seconds
  retries: 3,
  retryDelay: 1000,
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // Cache for 5 minutes
    strategy: 'memory',
  },
  headers: {
    'x-api-key': API_KEY,
    'x-partner-id': PARTNER_ID,
    'Accept': 'application/json',
  },
});

interface SailyPlan {
  covered_countries: string[];
  data_limit: {
    amount: number;
    is_unlimited: boolean;
    type: string;
    unit: string;
  };
  duration: {
    amount: number;
    unit: string;
  };
  identifier: string;
  is_unlimited: boolean;
  name: string;
  price: {
    amount_with_tax: number;
    currency: string;
    identifier: string;
  };
}

interface SailyApiResponse {
  items: SailyPlan[];
}

interface ProcessedPlan {
  id: string;
  name: string;
  data: string;
  validity: string;
  priceUSD: number;
  price: number;
  currency: string;
  identifier: string;
  priceIdentifier?: string;
  planType: 'global' | 'regional' | 'country';
  coveredCountries?: string[];
}

/**
 * Process and filter plans from Saily API response
 */
function processPlans(data: SailyApiResponse, countryCode?: string): ProcessedPlan[] {
  const allPlans = data.items
    .filter((plan: SailyPlan) => {
      // Filter out unrealistic data amounts (more than 100 GB)
      if (!plan.is_unlimited && plan.data_limit.amount > 100) {
        return false;
      }
      return true;
    })
    .map((plan: SailyPlan) => {
      const priceUSD = plan.price.amount_with_tax / 100;
      
      // Determine plan type
      let planType: 'global' | 'regional' | 'country';
      const planNameLower = plan.name.toLowerCase();
      
      const regionalKeywords = [
        'middle east',
        'north america',
        'south america',
        'europe',
        'asia',
        'balkans',
        'africa',
        'oceania'
      ];
      
      const isRegionalByName = regionalKeywords.some(keyword => planNameLower.includes(keyword));
      
      if (isRegionalByName && plan.covered_countries.length > 1 && plan.covered_countries.length <= 50) {
        planType = 'regional';
      } else if (plan.covered_countries.length > 50 || (!isRegionalByName && plan.covered_countries.length > 10)) {
        planType = 'global';
      } else if (plan.covered_countries.length > 1) {
        planType = 'regional';
      } else {
        planType = 'country';
      }
      
      return {
        id: plan.identifier,
        name: plan.name,
        data: plan.is_unlimited ? 'Unlimited' : `${plan.data_limit.amount} ${plan.data_limit.unit}`,
        validity: `${plan.duration.amount} ${plan.duration.unit === 'day' ? 'дни' : plan.duration.unit}`,
        priceUSD,
        price: priceUSD,
        currency: '$',
        identifier: plan.identifier,
        priceIdentifier: plan.price.identifier,
        planType,
        coveredCountries: plan.covered_countries,
      };
    });

  // Filter by country if provided
  if (countryCode) {
    const countryName = getCountryNameFromCode(countryCode);
    const countryRegex = new RegExp(`\\b${countryName.toLowerCase()}\\b`);
    
    return allPlans.filter((plan: ProcessedPlan) => {
      const coversCountry = plan.coveredCountries?.includes(countryCode);
      const nameContainsCountry = countryRegex.test(plan.name.toLowerCase());
      return coversCountry || nameContainsCountry;
    });
  }

  return allPlans;
}

function getCountryNameFromCode(countryCode: string): string {
  const countryMap: Record<string, string> = {
    'TH': 'thailand',
    'RS': 'serbia',
    'AE': 'dubai',
    'EG': 'egypt',
    'MA': 'morocco',
    'US': 'usa',
    'GB': 'uk',
    'TR': 'turkey'
  };
  return countryMap[countryCode] || countryCode.toLowerCase();
}

/**
 * GET handler with improved error handling and caching
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');

    // Fetch from Saily API with automatic retry and error handling
    const data = await sailyApiClient.get<SailyApiResponse>('', {
      cache: true,
      cacheKey: `saily-plans-${countryCode || 'all'}`,
    });

    // Process and filter plans
    const processedPlans = processPlans(data, countryCode || undefined);

    // Get current date in Bulgarian format
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const lastUpdated = dateFormatter.format(now);

    return NextResponse.json({
      success: true,
      plans: processedPlans,
      totalPlans: data.items.length,
      filteredPlans: processedPlans.length,
      countryCode: countryCode || 'all',
      lastUpdated,
    }, {
      // Set cache headers for client-side caching
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    // Use the centralized error handler
    if (error instanceof ApiClientError) {
      console.error('Saily API Error:', {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      // Return user-friendly error response
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch plans from Saily API',
          message: error.message,
          plans: [],
        },
        { status: error.status || 500 }
      );
    }

    // Handle unknown errors
    return handleApiError(error);
  }
}

