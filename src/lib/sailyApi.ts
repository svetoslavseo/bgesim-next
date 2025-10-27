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
  priceUSD: number; // Original USD price for conversion
  price: number;
  currency: string;
  identifier: string;
  priceIdentifier?: string; // Price identifier for Saily checkout
  planType: 'global' | 'regional' | 'country';
  coveredCountries?: string[]; // Countries covered by this plan
  ctaUrl?: string;
}

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

export async function fetchSailyPlans(countryCode?: string): Promise<ProcessedPlan[]> {
  try {
    console.log('Making Saily API request to:', API_URL);
    console.log('API Key:', API_KEY.substring(0, 10) + '...');
    console.log('Partner ID:', PARTNER_ID);
    
    const response = await fetch(API_URL, {
      headers: {
        'x-api-key': API_KEY,
        'x-partner-id': PARTNER_ID,
        'Accept': 'application/json',
      },
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data: SailyApiResponse = await response.json();
    console.log('Raw Saily API response:', data);
    console.log('Total items in response:', data.items.length);
    
    const allPlans = data.items
      .filter(plan => {
        // Filter out unrealistic data amounts (more than 100 GB)
        if (!plan.is_unlimited && plan.data_limit.amount > 100) {
          console.log(`Filtering out unrealistic plan: ${plan.name} with ${plan.data_limit.amount} ${plan.data_limit.unit}`);
          return false;
        }
        return true;
      })
      .map(plan => {
        const priceUSD = plan.price.amount_with_tax / 100; // Convert cents to USD
        return {
          id: plan.identifier,
          name: plan.name,
          data: plan.is_unlimited ? 'Unlimited' : `${plan.data_limit.amount} ${plan.data_limit.unit}`,
          validity: `${plan.duration.amount} ${plan.duration.unit === 'day' ? 'дни' : plan.duration.unit}`,
          priceUSD, // Store original USD price
          price: priceUSD, // Default price (will be converted in component)
          currency: '$',
          identifier: plan.identifier,
          priceIdentifier: plan.price.identifier, // Add price identifier
          planType: (plan.covered_countries.length > 10 ? 'global' : 
                    plan.covered_countries.length > 1 ? 'regional' : 'country') as 'global' | 'regional' | 'country',
          coveredCountries: plan.covered_countries, // Store covered countries for filtering
        };
      });

    // If country code is provided, filter plans for that country
    if (countryCode) {
      console.log(`Filtering plans for country: ${countryCode}`);
      console.log(`Total plans from API: ${allPlans.length}`);
      
      // First, let's see all plans that contain the country name in their name
      const countryName = getCountryNameFromCode(countryCode);
      console.log(`Looking for country name: ${countryName}`);
      
      const plansWithCountryName = allPlans.filter(plan => 
        plan.name.toLowerCase().includes(countryName.toLowerCase())
      );
      console.log(`Plans with country name "${countryName}":`, plansWithCountryName.map(p => p.name));
      
      const filteredPlans = allPlans.filter(plan => {
        const coversCountry = plan.coveredCountries.includes(countryCode);
        const nameContainsCountry = plan.name.toLowerCase().includes(countryName.toLowerCase());
        
        // Include all plan types (country, regional, global) that cover this country
        const shouldInclude = coversCountry || nameContainsCountry;
        
        if (shouldInclude) {
          console.log(`Including plan: ${plan.name} (type: ${plan.planType}, covers: ${coversCountry}, name: ${nameContainsCountry})`);
        }
        
        return shouldInclude;
      });
      
      console.log(`Filtered plans for ${countryCode}: ${filteredPlans.length}`);
      
      // If no plans found with filtering, return all plans for debugging
      if (filteredPlans.length === 0) {
        console.log('No plans found with filtering, returning all plans for debugging');
        return allPlans;
      }
      
      return filteredPlans;
    }

    return allPlans;
  } catch (error) {
    console.error('Error fetching Saily plans:', error);
    throw error;
  }
}

export function getPlansForCountry(plans: ProcessedPlan[], countryCode: string): ProcessedPlan[] {
  // Filter plans that cover the specific country (all plan types: country, regional, global)
  return plans.filter(plan => {
    const countryName = getCountryNameFromCode(countryCode);
    const coversCountry = plan.coveredCountries?.includes(countryCode);
    const nameContainsCountry = plan.name.toLowerCase().includes(countryName.toLowerCase());
    
    // Include all plan types (country, regional, global) that cover this country
    return coversCountry || nameContainsCountry;
  });
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

export function generateAffiliateLink(plan: ProcessedPlan): string {
  // Generate a unique transaction ID
  const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Use price identifier if available, otherwise use plan identifier
  const planId = plan.priceIdentifier || plan.identifier;
  const sailyCheckoutUrl = `https://saily.com/checkout/?planId=${planId}&aff_transaction_id=${transactionId}&aff_offer_id=101&aff_id=8080`;
  return `https://go.saily.site/aff_c?offer_id=101&aff_id=8080&url=${encodeURIComponent(sailyCheckoutUrl)}`;
}

/**
 * Get the lowest price for a country from plans
 */
export function getLowestPriceForCountry(countryCode: string): number {
  const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
  
  if (fallbackPlans.length === 0) {
    return 0;
  }
  
  // Find the lowest price among all plans for this country
  const lowestPrice = Math.min(...fallbackPlans.map(plan => plan.priceUSD));
  
  return lowestPrice;
}

/**
 * Calculate price per GB from a plan's data string
 * Examples: "3 GB" -> 3, "1 GB" -> 1, "Unlimited" -> null
 */
function extractGBFromData(data: string): number | null {
  if (data.toLowerCase().includes('unlimited')) {
    return null;
  }
  
  const match = data.match(/(\d+(?:\.\d+)?)\s*GB/i);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  
  return null;
}

/**
 * Calculate the lowest price per GB across all available plans
 * Returns the price in BGN per GB
 */
export async function getLowestPricePerGB(): Promise<{ pricePerGB: number; priceInBGN: string }> {
  try {
    // Try to fetch real plans first
    const plans = await fetchSailyPlans();
    
    if (plans && plans.length > 0) {
      // Filter plans with valid GB amounts and calculate price per GB
      const plansWithPricePerGB = plans
        .map(plan => {
          const gbAmount = extractGBFromData(plan.data);
          if (gbAmount && gbAmount > 0) {
            return {
              pricePerGBUSD: plan.priceUSD / gbAmount,
              plan
            };
          }
          return null;
        })
        .filter((result): result is { pricePerGBUSD: number; plan: ProcessedPlan } => result !== null);
      
      if (plansWithPricePerGB.length > 0) {
        const lowestPricePerGBUSD = Math.min(...plansWithPricePerGB.map(p => p.pricePerGBUSD));
        // Convert USD to BGN (1.8 BGN per USD)
        const pricePerGB = lowestPricePerGBUSD * 1.8;
        const priceInBGN = Math.round(pricePerGB).toString();
        
        console.log(`Lowest price per GB: ${lowestPricePerGBUSD.toFixed(2)} USD = ${priceInBGN}лв`);
        return { pricePerGB: lowestPricePerGBUSD, priceInBGN };
      }
    }
  } catch (error) {
    console.error('Error fetching plans for price per GB calculation:', error);
  }
  
  // Fallback to static plans
  const allFallbackPlans = Object.values(FALLBACK_PLANS).flat();
  
  const plansWithPricePerGB = allFallbackPlans
    .map(plan => {
      const gbAmount = extractGBFromData(plan.data);
      if (gbAmount && gbAmount > 0) {
        return {
          pricePerGBUSD: plan.priceUSD / gbAmount
        };
      }
      return null;
    })
    .filter((result): result is { pricePerGBUSD: number } => result !== null);
  
  if (plansWithPricePerGB.length === 0) {
    // Default fallback
    return { pricePerGB: 3.0, priceInBGN: '5' };
  }
  
  const lowestPricePerGBUSD = Math.min(...plansWithPricePerGB.map(p => p.pricePerGBUSD));
  const pricePerGB = lowestPricePerGBUSD * 1.8;
  const priceInBGN = Math.round(pricePerGB).toString();
  
  return { pricePerGB: lowestPricePerGBUSD, priceInBGN };
}

/**
 * Get the lowest price in BGN for a country
 */
export async function getLowestPriceInBGN(countryCode: string): Promise<number> {
  const { lowPrice } = await getPriceRangeInBGN(countryCode);
  return lowPrice;
}

export async function getPriceRangeInBGN(countryCode: string): Promise<{ lowPrice: number; highPrice: number; offerCount: number }> {
  try {
    // Try to fetch real plans first
    const plans = await fetchSailyPlans(countryCode);
    
    if (plans && plans.length > 0) {
      const pricesInBGN = plans.map(plan => Math.round(plan.priceUSD * 1.8));
      const lowPrice = Math.min(...pricesInBGN);
      const highPrice = Math.max(...pricesInBGN);
      const offerCount = plans.length;
      console.log(`Real plans for ${countryCode}: ${offerCount} offers, low: ${lowPrice}лв, high: ${highPrice}лв`);
      return { lowPrice, highPrice, offerCount };
    }
  } catch (error) {
    console.error('Error fetching real plans for price calculation:', error);
  }
  
  // Fallback to static plans
  const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
  
  if (fallbackPlans.length === 0) {
    const fallbackPrice = 9;
    return { lowPrice: fallbackPrice, highPrice: fallbackPrice, offerCount: 1 };
  }
  
  const pricesInBGN = fallbackPlans.map(plan => Math.round(plan.priceUSD * 1.8));
  const lowPrice = Math.min(...pricesInBGN);
  const highPrice = Math.max(...pricesInBGN);
  const offerCount = fallbackPlans.length;
  console.log(`Fallback plans for ${countryCode}: ${offerCount} offers, low: ${lowPrice}лв, high: ${highPrice}лв`);
  return { lowPrice, highPrice, offerCount };
}

// Fallback static plans for each country (all prices in USD for consistent conversion)
// Using the same structure as the main project's plans.json
export const FALLBACK_PLANS: Record<string, ProcessedPlan[]> = {
  'TH': [
    // Country Plans - Real data from Saily API
    {
      id: 'th-1',
      name: 'Thailand 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 2.99,
      price: 2.99,
      currency: '$',
      identifier: 'f21bf810-b394-4bb4-83d6-db8041e87105',
      priceIdentifier: 'MTpOUkFKTGp5VG5sblMxcnFMNTNVWUV5amFGWnBwOVJXOHJMRTQwNzdKZzFNPTpQcmljZTozMjA3LlVTRC4yOTk=',
      planType: 'country',
      coveredCountries: ['TH'],
    },
    {
      id: 'th-2',
      name: 'Thailand 3GB 30 days',
      data: '3 GB',
      validity: '30 дни',
      priceUSD: 5.99,
      price: 5.99,
      currency: '$',
      identifier: 'f608153f-71f6-4317-9ebf-be457a553ec4',
      priceIdentifier: 'MTpzRkx0eTlvbEFlaHo4LWxsTFhCSmxsVXpyeWhYOHlpM1dHdEYxUEZYdmtZPTpQcmljZTo1NTk3LlVTRC41OTk=',
      planType: 'country',
      coveredCountries: ['TH'],
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
      priceIdentifier: 'MTpEcXJZc29PWVhTX0FJQ2FBOWx1NjhqdDBYWVhVaUhDX25LZGxtRGp2cGhjPTpQcmljZTo1NTk4LlVTRC43OTk=',
      planType: 'country',
      coveredCountries: ['TH'],
    },
    {
      id: 'th-4',
      name: 'Thailand 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 10.99,
      price: 10.99,
      currency: '$',
      identifier: '132e15b5-6554-49b5-9838-68030210a27c',
      priceIdentifier: 'MToyMXZJTWkwTGFBemJKVTFnWmxrWlZ1R0plMUJkSWExeVBJOFZtYWdIbkw4PTpQcmljZTo1NTk5LlVTRC4xMDk5',
      planType: 'country',
      coveredCountries: ['TH'],
    },
    {
      id: 'th-5',
      name: 'Thailand 20GB 30 days',
      data: '20 GB',
      validity: '30 дни',
      priceUSD: 19.99,
      price: 19.99,
      currency: '$',
      identifier: 'dc49ebde-ea79-4054-80af-28e27130e1c2',
      priceIdentifier: 'MTpjOTlQeHhtVFRLM2dvUFNkMVBtSUVQLTZLVThkT0JxZjI5VkIyVHBlVE5jPTpQcmljZTo1NjAwLlVTRC4xOTk5',
      planType: 'country',
      coveredCountries: ['TH'],
    },
  ],
  'RS': [
    // Country Plans - Real data from Saily API
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
      coveredCountries: ['RS'],
    },
    {
      id: 'rs-2',
      name: 'Serbia 3GB 30 days',
      data: '3 GB',
      validity: '30 дни',
      priceUSD: 7.99,
      price: 7.99,
      currency: '$',
      identifier: 'd5250bc0-8be4-4ed1-b83e-09c551e8b565',
      priceIdentifier: 'MToyMHNWRXlrY08wSVBXVGtfQnptNFNKeXNCUnJBQTZDYTdkSUVwZFU0QzJRPTpQcmljZTozMTQ0LlVTRC43OTk=',
      planType: 'country',
      coveredCountries: ['RS'],
    },
    {
      id: 'rs-3',
      name: 'Serbia 5GB 30 days',
      data: '5 GB',
      validity: '30 дни',
      priceUSD: 10.99,
      price: 10.99,
      currency: '$',
      identifier: '3e530dbf-e379-4718-a7a7-b7f207b2df18',
      priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xMDk5',
      planType: 'country',
      coveredCountries: ['RS'],
    },
    {
      id: 'rs-4',
      name: 'Serbia 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 17.99,
      price: 17.99,
      currency: '$',
      identifier: '58cd29d8-c4e3-47b4-ad24-8b03efb49173',
      priceIdentifier: 'MTpSaFNUTG5mVXNsckRvU0pBQ24yemZVY21zbVNTbmZ0S0U4UWk2ZTJRUU84PTpQcmljZToyODEzLlVTRC4xNzk5',
      planType: 'country',
      coveredCountries: ['RS'],
    },
    {
      id: 'rs-5',
      name: 'Serbia 20GB 30 days',
      data: '20 GB',
      validity: '30 дни',
      priceUSD: 27.99,
      price: 27.99,
      currency: '$',
      identifier: 'cd90a7da-a22c-4d25-b628-5be35c02772f',
      priceIdentifier: 'MTpWRUF4RFF0dEkyLXV1VVFKOEhMYlRxQTJxa1V1d0pJYXliM1lSTUdaM2RJPTpQcmljZTozMTIyLlVTRC4yNzk5',
      planType: 'country',
      coveredCountries: ['RS'],
    },
    // Global Plans - Real data from Saily API
    {
      id: 'rs-global-1',
      name: 'Global 20GB 365 days',
      data: '20 GB',
      validity: '365 дни',
      priceUSD: 66.99,
      price: 66.99,
      currency: '$',
      identifier: 'b4932f6c-f327-401e-83c4-edc7c7d78f29',
      priceIdentifier: 'MToyMWdrUkNVcjU5cG1oYzVoMWhsVkpMLVhTMUkxQU5ZMzFqWWhRWDV3ME5VPTpQcmljZTozMzM5LlVTRC42Njk5',
      planType: 'global',
      coveredCountries: ['RS', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ', 'AE', 'SA', 'JP', 'KR', 'CA', 'MX', 'AR', 'BR', 'CL', 'CO', 'PE'],
    },
    {
      id: 'rs-global-2',
      name: 'Global 10GB 180 days',
      data: '10 GB',
      validity: '180 дни',
      priceUSD: 56.99,
      price: 56.99,
      currency: '$',
      identifier: 'e34d1fcd-c81d-4073-bb23-174e13759863',
      priceIdentifier: 'MTpwMlhKTnkxN3gtU1RaV2NwUnBSWThFTUFRLUJNUHhSbElBaU5ZWmMtQXhRPTpQcmljZTozMzQwLlVTRC41Njk5',
      planType: 'global',
      coveredCountries: ['RS', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ', 'AE', 'SA', 'JP', 'KR', 'CA', 'MX', 'AR', 'BR', 'CL', 'CO', 'PE'],
    },
    {
      id: 'rs-global-3',
      name: 'Global 5GB 60 days',
      data: '5 GB',
      validity: '60 дни',
      priceUSD: 33.99,
      price: 33.99,
      currency: '$',
      identifier: 'a919bc99-4caf-4d76-8f07-5f65d7b44828',
      priceIdentifier: 'MTpEYVpGZUZOU0Z6Wjdscmh6ZXNaYjNWZFI1MHJ5bVJ6WmQ1Zm5ucVExSTlJPTpQcmljZTozMzQxLlVTRC4zMzk5',
      planType: 'global',
      coveredCountries: ['RS', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ', 'AE', 'SA', 'JP', 'KR', 'CA', 'MX', 'AR', 'BR', 'CL', 'CO', 'PE'],
    },
  ],
  'AE': [
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
    },
  ],
  'EG': [
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
    },
  ],
  'US': [
    // Country Plans - Real data from Saily API
    {
      id: 'us-1',
      name: 'USA 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 3.99,
      price: 3.99,
      currency: '$',
      identifier: '1e01ed9f-5a60-4314-a37e-9117c56d29cd',
      priceIdentifier: 'MTpHbmV2Z1BYUUZ6QVFESmdBVlJaX05pQnl0LWZYXzNGZEQzT18ycXBCazRZPTpQcmljZToyNjQxLlVTRC4zOTk=',
      planType: 'country',
      coveredCountries: ['US'],
    },
    {
      id: 'us-2',
      name: 'USA 3GB 30 days',
      data: '3 GB',
      validity: '30 дни',
      priceUSD: 8.99,
      price: 8.99,
      currency: '$',
      identifier: '42392cf4-5a44-42a1-8a1b-f85b9c340a5f',
      priceIdentifier: 'MTp3THNwR2pJNHJrLTdQbVpUVzUtY2tXLTg1R3RIbGxYZmhueDVEN2ttUjJRPTpQcmljZToyNzQxLlVTRC44OTk=',
      planType: 'country',
      coveredCountries: ['US'],
    },
    {
      id: 'us-3',
      name: 'USA 5GB 30 days',
      data: '5 GB',
      validity: '30 дни',
      priceUSD: 13.99,
      price: 13.99,
      currency: '$',
      identifier: '79c9363d-2083-46da-ae4d-c0ecebab4239',
      priceIdentifier: 'MTpBdnAtV3JSS2dhSFIyMHB5NFpOOXNjeVNNR3VNQXh6WlJxTlJZTmpURUpnPTpQcmljZToyODkyLlVTRC4xMzk5',
      planType: 'country',
      coveredCountries: ['US'],
    },
    {
      id: 'us-4',
      name: 'USA 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 22.99,
      price: 22.99,
      currency: '$',
      identifier: 'f2b4dd03-3fcc-4bab-a3f7-2eb314a72ae5',
      priceIdentifier: 'MToxbFVUUVpMYWRVQ2p6SFN4SldJaThkakpzeFpMb1ViSlR0bllDRUFYclpjPTpQcmljZTozMjA4LlVTRC4yMjk5',
      planType: 'country',
      coveredCountries: ['US'],
    },
    {
      id: 'us-5',
      name: 'USA 20GB 30 days',
      data: '20 GB',
      validity: '30 дни',
      priceUSD: 36.99,
      price: 36.99,
      currency: '$',
      identifier: 'f5769845-9b0f-4fbc-9d0a-5f31b94589c5',
      priceIdentifier: 'MTpuQUM5SlJqaHE1VjlNM3pwTHFUeXBMbEFQVXFoYUhKWlEzSUJoQ2o3Tm1ZPTpQcmljZTozMjE5LlVTRC4zNjk5',
      planType: 'country',
      coveredCountries: ['US'],
    },
  ],
  'GB': [
    // Country Plans - Real data from Saily API
    {
      id: 'gb-1',
      name: 'UK 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 4.49,
      price: 4.49,
      currency: '$',
      identifier: '49feaf17-3280-4c5d-bdb5-ed4a5db30287',
      priceIdentifier: 'MTpGUmloaHViVnVRMU5oNFZSd1Rxdy1EMzhCLWd2cFZvLW55OG8tZHZjOGNVPTpQcmljZToyNzYxLlVTRC40NDk=',
      planType: 'country',
      coveredCountries: ['GB'],
    },
    {
      id: 'gb-2',
      name: 'UK 3GB 30 days',
      data: '3 GB',
      validity: '30 дни',
      priceUSD: 8.99,
      price: 8.99,
      currency: '$',
      identifier: '502467ca-1926-4576-a39a-b8d386741d61',
      priceIdentifier: 'MTpUWHRfMzNDb1F0Y0lzX0VmUllZbGt1QXd5TlczZEtHUWxqdHAwUUl5SkhBPTpQcmljZToyNzg1LlVTRC44OTk=',
      planType: 'country',
      coveredCountries: ['GB'],
    },
    {
      id: 'gb-3',
      name: 'UK 5GB 30 days',
      data: '5 GB',
      validity: '30 дни',
      priceUSD: 12.99,
      price: 12.99,
      currency: '$',
      identifier: '42ba26de-32f6-463c-8992-446a0d3a6624',
      priceIdentifier: 'MTpjT3VRTy1DWi1pNWtIamhQQTg1TjZQejZHRWc2QmxranhrejZGT3RDUXpZPTpQcmljZToyNzQ0LlVTRC4xMjk5',
      planType: 'country',
      coveredCountries: ['GB'],
    },
    {
      id: 'gb-4',
      name: 'UK 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 19.99,
      price: 19.99,
      currency: '$',
      identifier: '34734abd-5eb3-4563-8bb1-1172607980dc',
      priceIdentifier: 'MTpjRkF3NF9wZVh2cWVuVFpVWi00OEk4d0Fwb0dnVWNMZzVEelZaZW9PQlRJPTpQcmljZToyNzA1LlVTRC4xOTk5',
      planType: 'country',
      coveredCountries: ['GB'],
    },
    {
      id: 'gb-5',
      name: 'UK 20GB 30 days',
      data: '20 GB',
      validity: '30 дни',
      priceUSD: 31.99,
      price: 31.99,
      currency: '$',
      identifier: '4f0814c8-b2e5-49c7-99bf-77dd918ab91f',
      priceIdentifier: 'MTo0b0lyRDFiV2VEWUJFZkJMNGQtNm1ZdUlOWjRHU3V6OUVmM3gxeS16RjdzPTpQcmljZToyNzgzLlVTRC4zMTk5',
      planType: 'country',
      coveredCountries: ['GB'],
    },
  ],
  'TR': [
    // Country Plans - Real data from Saily API
    {
      id: 'tr-1',
      name: 'Turkey 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 3.99,
      price: 3.99,
      currency: '$',
      identifier: '09afe92c-27f0-4a5f-b1a0-069eab309fb0',
      priceIdentifier: 'MTpkMjhYdEhrMmg0ak9tNURiS2YwTmtkSDJRN1l1aDJZRzRIWDdzS04tSGhRPTpQcmljZToyNTg5LlVTRC4zOTk=',
      planType: 'country',
      coveredCountries: ['TR'],
    },
    {
      id: 'tr-2',
      name: 'Turkey 3GB 30 days',
      data: '3 GB',
      validity: '30 дни',
      priceUSD: 6.99,
      price: 6.99,
      currency: '$',
      identifier: 'bd9ea4e9-bbf3-4590-8524-f71e5606e98c',
      priceIdentifier: 'MTpZMkdEZkczSndYa0s3VG9COEppdnR5TUxGYnhNT1ViNUhfNkE2ai04ck1RPTpQcmljZTozMDc0LlVTRC42OTk=',
      planType: 'country',
      coveredCountries: ['TR'],
    },
    {
      id: 'tr-3',
      name: 'Turkey 5GB 30 days',
      data: '5 GB',
      validity: '30 дни',
      priceUSD: 9.99,
      price: 9.99,
      currency: '$',
      identifier: 'd70f569a-34b6-4613-85f5-b85ed2e8b3ae',
      priceIdentifier: 'MTpXWEhQWFNkd1ktN2hBUDNOUnhxS0xocHZITW16dUswdlZiaUJvMWcteGNRPTpQcmljZTozMTUyLlVTRC45OTk=',
      planType: 'country',
      coveredCountries: ['TR'],
    },
    {
      id: 'tr-4',
      name: 'Turkey 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: '087c92ef-b065-4aa5-a41c-87237bc3fa02',
      priceIdentifier: 'MTpYX1dIUzFMQjA2RWliZ2lNMHdzR1RWbm5OQ29PeUFjMWFCVkt6TlBNOC1zPTpQcmljZToyNTg1LlVTRC4xNTk5',
      planType: 'country',
      coveredCountries: ['TR'],
    },
    {
      id: 'tr-5',
      name: 'Turkey 20GB 30 days',
      data: '20 GB',
      validity: '30 дни',
      priceUSD: 22.99,
      price: 22.99,
      currency: '$',
      identifier: '71d5a448-9bf9-4055-ade2-6e034020e27d',
      priceIdentifier: 'MTp0SDlGOXNJNC1PbElwNFRnZlBtR1ZnWDI3UHBIWVlvSThDa1JFdXloSW5zPTpQcmljZToyODc0LlVTRC4yMjk5',
      planType: 'country',
      coveredCountries: ['TR'],
    },
  ]
};
