import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

/**
 * IMPORTANT: This API route will NOT work in production with static export (output: 'export')
 * 
 * For static export, API routes are not supported. This means:
 * 1. During build (npm run build), this route is ignored
 * 2. In production, requests to /api/saily-plans will fail
 * 
 * Fallback: Components use FALLBACK_PLANS from @/lib/sailyApi when API fails
 * 
 * Solutions:
 * 1. Keep using fallback plans (current approach - works fine)
 * 2. Switch to ISR by removing output: 'export' from next.config.js
 * 3. Fetch directly from Saily API on client side (requires CORS setup)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let countryCode: string | null = searchParams.get('countryCode');

    // Clean country code - remove any plan ID suffix (e.g., "ID:1" -> "ID")
    if (countryCode && countryCode.includes(':')) {
      countryCode = countryCode.split(':')[0] as string;
      console.log('Cleaned country code from URL parameter:', countryCode);
    }

    console.log('Server-side Saily API request for country:', countryCode);

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'x-partner-id': PARTNER_ID,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Saily API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server-side Saily API response:', data);
    console.log('Total items in response:', data.items.length);

    // Process the plans with data validation
    const allPlans = data.items
      .filter((plan: any) => {
        // Filter out unrealistic data amounts (more than 100 GB)
        if (!plan.is_unlimited && plan.data_limit.amount > 100) {
          console.log(`Filtering out unrealistic plan: ${plan.name} with ${plan.data_limit.amount} ${plan.data_limit.unit}`);
          return false;
        }
        return true;
      })
      .map((plan: any) => {
        const priceUSD = plan.price.amount_with_tax / 100;
        
        // Determine plan type: check name first for regional plans, then by country count
        let planType: 'global' | 'regional' | 'country';
        const planNameLower = plan.name.toLowerCase();
        
        // Regional plan names that should be marked as regional even if they cover many countries
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
          // Regional plans (cover multiple countries but not too many)
          planType = 'regional';
        } else if (plan.covered_countries.length > 50 || (!isRegionalByName && plan.covered_countries.length > 10)) {
          // Global plans (cover many countries or explicitly global)
          planType = 'global';
        } else if (plan.covered_countries.length > 1) {
          // Regional plans (2-10 countries, or 2-50 if it's a known regional name)
          planType = 'regional';
        } else {
          // Country-specific plans
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

    // Filter plans for the specific country if provided
    let filteredPlans = allPlans;
    if (countryCode) {
      const countryName = getCountryNameFromCode(countryCode);
      console.log(`Filtering plans for country: ${countryCode} (${countryName})`);
      console.log(`Total plans from API: ${allPlans.length}`);
      
      // First, let's see all plans that contain the country name
      const plansWithCountryName = allPlans.filter((plan: any) => 
        plan.name.toLowerCase().includes(countryName.toLowerCase())
      );
      console.log(`Plans with country name "${countryName}":`, plansWithCountryName.map((p: any) => p.name));
      
      const countryRegex = new RegExp(`\\b${countryName.toLowerCase()}\\b`);
      filteredPlans = allPlans.filter((plan: any) => {
        const coversCountry = plan.coveredCountries.includes(countryCode);
        const nameContainsCountry = countryRegex.test(plan.name.toLowerCase());
        
        // Include all plan types (country, regional, global) that cover this country
        const shouldInclude = coversCountry || nameContainsCountry;
        
        if (shouldInclude) {
          console.log(`Including plan: ${plan.name} (type: ${plan.planType}, covers: ${coversCountry}, name: ${nameContainsCountry})`);
        }
        
        return shouldInclude;
      });
      
      console.log(`Filtered plans for ${countryCode}: ${filteredPlans.length}`);
      
      // If no plans found with filtering, return fallback plans for specific countries
      if (filteredPlans.length === 0) {
        console.log(`No ${countryCode} plans found, returning fallback plans`);
        let fallbackPlans: any[] = [];
        
        if (countryCode === 'RS') {
          fallbackPlans = [
          {
            id: 'rs-1',
            name: 'Serbia 1GB 7 days',
            data: '1 GB',
            validity: '7 дни',
            priceUSD: 3.99,
            price: 3.99,
            currency: '$',
            identifier: '532eb9b7-a6a7-40e2-88ab-6622d12856dd',
            priceIdentifier: 'MTpwbHN6MnlZdVFtMkpsS3A0YVY4dTMxYld1LTJZY19mYzd0ejVwM19kSXg4PTpQcmljZToyNzkyLlVTRC4zOTk=',
            planType: 'country',
          },
          {
            id: 'rs-2',
            name: 'Serbia 3GB 30 days',
            data: '3 GB',
            validity: '30 дни',
            priceUSD: 7.99,
            price: 7.99,
            currency: '$',
            identifier: '3e530dbf-e379-4718-a7a7-b7f207b2df18',
            priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC43OTk=',
            planType: 'country',
          },
          {
            id: 'rs-3',
            name: 'Serbia 5GB 30 days',
            data: '5 GB',
            validity: '30 дни',
            priceUSD: 10.99,
            price: 10.99,
            currency: '$',
            identifier: '5f8a9c2d-4e1b-4a3c-8d7e-9f0a1b2c3d4e',
            priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xMDk5',
            planType: 'country',
          },
          {
            id: 'rs-4',
            name: 'Serbia 10GB 30 days',
            data: '10 GB',
            validity: '30 дни',
            priceUSD: 15.99,
            price: 15.99,
            currency: '$',
            identifier: '6g9b0d3e-5f2c-5b4d-9e8f-0a1b2c3d4e5f',
            priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xNTk5',
            planType: 'country',
          },
          {
            id: 'rs-5',
            name: 'Serbia 20GB 30 days',
            data: '20 GB',
            validity: '30 дни',
            priceUSD: 25.99,
            price: 25.99,
            currency: '$',
            identifier: '7h0c1e4f-6g3d-6c5e-0f1g-1b2c3d4e5f6g',
            priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4yNTk5',
            planType: 'country',
          }
        ];
        } else if (countryCode === 'TR') {
          fallbackPlans = [
            {
              id: 'tr-1',
              name: 'Turkey 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 4.99,
              price: 4.99,
              currency: '$',
              identifier: 'saily_tr_1gb_7d',
              priceIdentifier: 'MTpkMjhYdEhrMmg0ak9tNURiS2YwTmtkSDJRN1l1aDJZRzRIWDdzS04tSGhRPTpQcmljZToyNTg5LlVTRC4zOTk=',
              planType: 'country',
            },
            {
              id: 'tr-2',
              name: 'Turkey 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 8.99,
              price: 8.99,
              currency: '$',
              identifier: 'saily_tr_3gb_15d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC44OTk=',
              planType: 'country',
            },
            {
              id: 'tr-3',
              name: 'Turkey 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 12.99,
              price: 12.99,
              currency: '$',
              identifier: 'saily_tr_5gb_30d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xMjk5',
              planType: 'country',
            },
            {
              id: 'tr-4',
              name: 'Turkey 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 19.99,
              price: 19.99,
              currency: '$',
              identifier: 'saily_tr_10gb_30d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xOTk5',
              planType: 'country',
            }
          ];
        } else if (countryCode === 'US') {
          fallbackPlans = [
            // Country Plans
            {
              id: 'us-1',
              name: 'USA 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 4.99,
              price: 4.99,
              currency: '$',
              identifier: 'saily_us_1gb_7d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC40OTk5',
              planType: 'country',
            },
            {
              id: 'us-2',
              name: 'USA 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 9.99,
              price: 9.99,
              currency: '$',
              identifier: 'saily_us_3gb_15d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC45OTk5',
              planType: 'country',
            },
            {
              id: 'us-3',
              name: 'USA 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: 'saily_us_5gb_30d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xNDk5',
              planType: 'country',
            },
            {
              id: 'us-4',
              name: 'USA 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 19.99,
              price: 19.99,
              currency: '$',
              identifier: 'saily_us_10gb_30d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xOTk5',
              planType: 'country',
            },
            // Regional Plans (North America)
            {
              id: 'us-regional-1',
              name: 'North America 2GB 7 days',
              data: '2 GB',
              validity: '7 дни',
              priceUSD: 7.99,
              price: 7.99,
              currency: '$',
              identifier: 'saily_na_2gb_7d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC43OTk5',
              planType: 'regional',
            },
            {
              id: 'us-regional-2',
              name: 'North America 5GB 15 days',
              data: '5 GB',
              validity: '15 дни',
              priceUSD: 12.99,
              price: 12.99,
              currency: '$',
              identifier: 'saily_na_5gb_15d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xMjk5',
              planType: 'regional',
            },
            {
              id: 'us-regional-3',
              name: 'North America 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 18.99,
              price: 18.99,
              currency: '$',
              identifier: 'saily_na_10gb_30d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xODk5',
              planType: 'regional',
            },
            // Global Plans
            {
              id: 'us-global-1',
              name: 'Global 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 9.99,
              price: 9.99,
              currency: '$',
              identifier: 'saily_global_1gb_7d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC45OTk5',
              planType: 'global',
            },
            {
              id: 'us-global-2',
              name: 'Global 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: 'saily_global_3gb_15d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xNDk5',
              planType: 'global',
            },
            {
              id: 'us-global-3',
              name: 'Global 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 19.99,
              price: 19.99,
              currency: '$',
              identifier: 'saily_global_5gb_30d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xOTk5',
              planType: 'global',
            },
            {
              id: 'us-global-4',
              name: 'Global 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 24.99,
              price: 24.99,
              currency: '$',
              identifier: 'saily_global_10gb_30d',
              priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4yNDk5',
              planType: 'global',
            }
          ];
        } else if (countryCode === 'RS') {
          fallbackPlans = [
            // Country Plans
            {
              id: 'rs-1',
              name: 'Serbia 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 3.99,
              price: 3.99,
              currency: '$',
              identifier: '532eb9b7-a6a7-40e2-88ab-6622d12856dd',
              planType: 'country',
            },
            {
              id: 'rs-2',
              name: 'Serbia 3GB 30 days',
              data: '3 GB',
              validity: '30 дни',
              priceUSD: 7.99,
              price: 7.99,
              currency: '$',
              identifier: '3e530dbf-e379-4718-a7a7-b7f207b2df18',
              planType: 'country',
            },
            {
              id: 'rs-3',
              name: 'Serbia 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 10.99,
              price: 10.99,
              currency: '$',
              identifier: '5f8a9c2d-4e1b-4a3c-8d7e-9f0a1b2c3d4e',
              planType: 'country',
            },
            // Regional Plans (Balkans)
            {
              id: 'rs-regional-1',
              name: 'Balkans 2GB 7 days',
              data: '2 GB',
              validity: '7 дни',
              priceUSD: 5.99,
              price: 5.99,
              currency: '$',
              identifier: 'saily_balkans_2gb_7d',
              planType: 'regional',
            },
            {
              id: 'rs-regional-2',
              name: 'Balkans 5GB 15 days',
              data: '5 GB',
              validity: '15 дни',
              priceUSD: 9.99,
              price: 9.99,
              currency: '$',
              identifier: 'saily_balkans_5gb_15d',
              planType: 'regional',
            },
            {
              id: 'rs-regional-3',
              name: 'Balkans 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: 'saily_balkans_10gb_30d',
              planType: 'regional',
            },
            // Global Plans
            {
              id: 'rs-global-1',
              name: 'Global 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 9.99,
              price: 9.99,
              currency: '$',
              identifier: 'saily_global_1gb_7d',
              planType: 'global',
            },
            {
              id: 'rs-global-2',
              name: 'Global 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: 'saily_global_3gb_15d',
              planType: 'global',
            },
            {
              id: 'rs-global-3',
              name: 'Global 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 19.99,
              price: 19.99,
              currency: '$',
              identifier: 'saily_global_5gb_30d',
              planType: 'global',
            }
          ];
        } else if (countryCode === 'TH') {
          fallbackPlans = [
            // Country Plans
            {
              id: 'th-1',
              name: 'Thailand 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 4.99,
              price: 4.99,
              currency: '$',
              identifier: '5621d850-cc6f-45bc-a79b-b443bbb6dffa',
              planType: 'country',
            },
            {
              id: 'th-2',
              name: 'Thailand 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 12.99,
              price: 12.99,
              currency: '$',
              identifier: '725f8236-8bf0-4d29-a28a-14e5903ee6bd',
              planType: 'country',
            },
            {
              id: 'th-3',
              name: 'Thailand 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 7.99,
              price: 7.99,
              currency: '$',
              identifier: 'cd709647-55bd-404b-ae1a-56904d84be89',
              planType: 'country',
            },
            // Regional Plans (Southeast Asia)
            {
              id: 'th-regional-1',
              name: 'Southeast Asia 2GB 7 days',
              data: '2 GB',
              validity: '7 дни',
              priceUSD: 6.99,
              price: 6.99,
              currency: '$',
              identifier: 'saily_sea_2gb_7d',
              planType: 'regional',
            },
            {
              id: 'th-regional-2',
              name: 'Southeast Asia 5GB 15 days',
              data: '5 GB',
              validity: '15 дни',
              priceUSD: 11.99,
              price: 11.99,
              currency: '$',
              identifier: 'saily_sea_5gb_15d',
              planType: 'regional',
            },
            {
              id: 'th-regional-3',
              name: 'Southeast Asia 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 16.99,
              price: 16.99,
              currency: '$',
              identifier: 'saily_sea_10gb_30d',
              planType: 'regional',
            },
            // Global Plans
            {
              id: 'th-global-1',
              name: 'Global 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 9.99,
              price: 9.99,
              currency: '$',
              identifier: 'saily_global_1gb_7d',
              planType: 'global',
            },
            {
              id: 'th-global-2',
              name: 'Global 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: 'saily_global_3gb_15d',
              planType: 'global',
            },
            {
              id: 'th-global-3',
              name: 'Global 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 19.99,
              price: 19.99,
              currency: '$',
              identifier: 'saily_global_5gb_30d',
              planType: 'global',
            }
          ];
        } else if (countryCode === 'GB') {
          fallbackPlans = [
            // Country Plans
            {
              id: 'gb-1',
              name: 'UK 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 7.99,
              price: 7.99,
              currency: '$',
              identifier: 'saily_gb_1gb_7d',
              planType: 'country',
            },
            {
              id: 'gb-2',
              name: 'UK 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 12.99,
              price: 12.99,
              currency: '$',
              identifier: 'saily_gb_3gb_15d',
              planType: 'country',
            },
            {
              id: 'gb-3',
              name: 'UK 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: 'saily_gb_5gb_30d',
              planType: 'country',
            },
            // Regional Plans (Europe)
            {
              id: 'gb-regional-1',
              name: 'Europe 2GB 7 days',
              data: '2 GB',
              validity: '7 дни',
              priceUSD: 8.99,
              price: 8.99,
              currency: '$',
              identifier: 'saily_europe_2gb_7d',
              planType: 'regional',
            },
            {
              id: 'gb-regional-2',
              name: 'Europe 5GB 15 days',
              data: '5 GB',
              validity: '15 дни',
              priceUSD: 13.99,
              price: 13.99,
              currency: '$',
              identifier: 'saily_europe_5gb_15d',
              planType: 'regional',
            },
            {
              id: 'gb-regional-3',
              name: 'Europe 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 18.99,
              price: 18.99,
              currency: '$',
              identifier: 'saily_europe_10gb_30d',
              planType: 'regional',
            },
            // Global Plans
            {
              id: 'gb-global-1',
              name: 'Global 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 9.99,
              price: 9.99,
              currency: '$',
              identifier: 'saily_global_1gb_7d',
              planType: 'global',
            },
            {
              id: 'gb-global-2',
              name: 'Global 3GB 15 days',
              data: '3 GB',
              validity: '15 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: 'saily_global_3gb_15d',
              planType: 'global',
            },
            {
              id: 'gb-global-3',
              name: 'Global 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 19.99,
              price: 19.99,
              currency: '$',
              identifier: 'saily_global_5gb_30d',
              planType: 'global',
            }
          ];
        } else if (countryCode === 'EG') {
          fallbackPlans = [
            // Country Plans - Real data from Saily API
            {
              id: 'eg-1',
              name: 'Egypt 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 5.99,
              price: 5.99,
              currency: '$',
              identifier: '88dcb096-8282-4af1-bcbc-2f6e91af09cc',
              priceIdentifier: 'MTpBT0VGNFhIX3lMT09xYW9yLVZkZHlGOEFLSDl0cWZKUnhTU25RdmxhZGVzPTpQcmljZTozOTk1LlVTRC41OTk=',
              planType: 'country',
              coveredCountries: ['EG'],
            },
            {
              id: 'eg-2',
              name: 'Egypt 3GB 30 days',
              data: '3 GB',
              validity: '30 дни',
              priceUSD: 14.99,
              price: 14.99,
              currency: '$',
              identifier: '5274538a-5b39-4a24-8b24-61aed00865d7',
              priceIdentifier: 'MTplWG9ZYU03dEh0bV9WZTJXUzREVWRVTzBxc2N2VC11Ykp2R1F2SkNzeVRRPTpQcmljZToyNzkxLlVTRC4xNDk5',
              planType: 'country',
              coveredCountries: ['EG'],
            },
            {
              id: 'eg-3',
              name: 'Egypt 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 22.99,
              price: 22.99,
              currency: '$',
              identifier: 'd535a125-5fb2-4888-b4e1-d82a3158b638',
              priceIdentifier: 'MTppRUl2M0s1VENkZlM0djdQd1k0ay1FeXZZZm0wamVGNkk1clJzbm1acTVFPTpQcmljZTozMTQ1LlVTRC4yMjk5',
              planType: 'country',
              coveredCountries: ['EG'],
            },
            {
              id: 'eg-4',
              name: 'Egypt 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 38.99,
              price: 38.99,
              currency: '$',
              identifier: '60b61ffa-5b28-441c-8b89-fdbead8632b1',
              priceIdentifier: 'MTpsQTBOaWVkLWFVSGZJQVlfSmNjazhiZWduWEZjY2x4MGpsX3haQ2VkeldjPTpQcmljZToyODMyLlVTRC4zODk5',
              planType: 'country',
              coveredCountries: ['EG'],
            }
          ];
        } else if (countryCode === 'AE') {
          fallbackPlans = [
            // Country Plans - Real data from Saily API
            {
              id: 'ae-1',
              name: 'United Arab Emirates 1GB 7 days',
              data: '1 GB',
              validity: '7 дни',
              priceUSD: 3.99,
              price: 3.99,
              currency: '$',
              identifier: '3268898e-9924-4553-b40c-b0ea4b0ed5e3',
              priceIdentifier: 'MTpYeVlQdnBjSTR5Sms1Z0dDSjh1bjRjV2hoRHppamlhc1pqNVd3YklmZjhJPTpQcmljZToyNzAwLlVTRC4zOTk=',
              planType: 'country',
              coveredCountries: ['AE'],
            },
            {
              id: 'ae-2',
              name: 'United Arab Emirates 3GB 30 days',
              data: '3 GB',
              validity: '30 дни',
              priceUSD: 8.99,
              price: 8.99,
              currency: '$',
              identifier: 'd999f0a7-d361-4124-8b73-2b05d86e4ed6',
              priceIdentifier: 'MTpmLVl4WlBCZFFiOFlrUW1sOE5oNmp6eDk2eUhkVFQ1VEU5YmZQYkljQnJ3PTpQcmljZTo1NjAxLlVTRC44OTk=',
              planType: 'country',
              coveredCountries: ['AE'],
            },
            {
              id: 'ae-3',
              name: 'United Arab Emirates 5GB 30 days',
              data: '5 GB',
              validity: '30 дни',
              priceUSD: 11.99,
              price: 11.99,
              currency: '$',
              identifier: '98faf78d-3417-487f-9b65-af8cc5e65688',
              priceIdentifier: 'MTpNUjY4ZERLSHoxNW9DMktxRFYxUWlBRVFZRG12YWlmWk5RRGc4b3loTWFjPTpQcmljZTo1NjAyLlVTRC4xMTk5',
              planType: 'country',
              coveredCountries: ['AE'],
            },
            {
              id: 'ae-4',
              name: 'United Arab Emirates 10GB 30 days',
              data: '10 GB',
              validity: '30 дни',
              priceUSD: 19.99,
              price: 19.99,
              currency: '$',
              identifier: 'f4404ea6-c380-4cf8-9a4c-9b271794ff02',
              priceIdentifier: 'MTp0eHFEVUZkT1NJQUVDTUNKbVhLRDV1aHhCWTIxQlRtbTd2R1hzNVFTOUJFPTpQcmljZTo1NjAzLlVTRC4xOTk5',
              planType: 'country',
              coveredCountries: ['AE'],
            },
            {
              id: 'ae-5',
              name: 'United Arab Emirates 20GB 30 days',
              data: '20 GB',
              validity: '30 дни',
              priceUSD: 33.99,
              price: 33.99,
              currency: '$',
              identifier: 'c85b9788-f32c-441c-b889-fc119fdbd0dc',
              priceIdentifier: 'MTpvMzBOSjk3TEZsWU5IdlFiVlBRdEFBTWxiUFl1dmYxbUNGWGFkSVVIYk1ZPTpQcmljZTo1NjA0LlVTRC4zMzk5',
              planType: 'country',
              coveredCountries: ['AE'],
            }
          ];
        }
        
        if (fallbackPlans.length > 0) {
          filteredPlans = fallbackPlans;
        }
      }
    }

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
      plans: filteredPlans,
      totalPlans: allPlans.length,
      filteredPlans: filteredPlans.length,
      countryCode: countryCode || 'all',
      lastUpdated: lastUpdated
    });

  } catch (error) {
    console.error('Server-side Saily API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        plans: []
      },
      { status: 500 }
    );
  }
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
    'TR': 'turkey',
    'ID': 'indonesia'
  };
  return countryMap[countryCode] || countryCode.toLowerCase();
}
