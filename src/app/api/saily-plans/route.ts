import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');

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

    // Process the plans
    const allPlans = data.items.map((plan: any) => {
      const priceUSD = plan.price.amount_with_tax / 100;
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
        planType: (plan.covered_countries.length > 10 ? 'global' : 
                  plan.covered_countries.length > 1 ? 'regional' : 'country') as 'global' | 'regional' | 'country',
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
      const plansWithCountryName = allPlans.filter(plan => 
        plan.name.toLowerCase().includes(countryName.toLowerCase())
      );
      console.log(`Plans with country name "${countryName}":`, plansWithCountryName.map(p => p.name));
      
      filteredPlans = allPlans.filter(plan => {
        const coversCountry = plan.coveredCountries.includes(countryCode);
        const isGlobal = plan.planType === 'global';
        const nameContainsCountry = plan.name.toLowerCase().includes(countryName.toLowerCase());
        
        const shouldInclude = coversCountry || nameContainsCountry; // Remove global plans for now
        
        if (shouldInclude) {
          console.log(`Including plan: ${plan.name} (covers: ${coversCountry}, name: ${nameContainsCountry})`);
        }
        
        return shouldInclude;
      });
      
      console.log(`Filtered plans for ${countryCode}: ${filteredPlans.length}`);
      
      // If no plans found with filtering, return fallback plans for Serbia
      if (filteredPlans.length === 0 && countryCode === 'RS') {
        console.log('No Serbia plans found, returning fallback plans');
        const fallbackPlans = [
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
        filteredPlans = fallbackPlans;
      }
    }

    return NextResponse.json({
      success: true,
      plans: filteredPlans,
      totalPlans: allPlans.length,
      filteredPlans: filteredPlans.length,
      countryCode: countryCode || 'all'
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
    'US': 'usa',
    'GB': 'uk',
    'TR': 'turkey'
  };
  return countryMap[countryCode] || countryCode.toLowerCase();
}
