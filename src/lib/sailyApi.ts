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
    // Country Plans
    {
      id: 'th-1',
      name: 'Thailand 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 4.99,
      price: 4.99,
      currency: '$',
      identifier: '5621d850-cc6f-45bc-a79b-b443bbb6dffa', // Real Saily identifier from main project
      planType: 'country',
      coveredCountries: ['TH'],
    },
    {
      id: 'th-2',
      name: 'Thailand 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 12.99,
      price: 12.99,
      currency: '$',
      identifier: '725f8236-8bf0-4d29-a28a-14e5903ee6bd', // Real Saily identifier from main project
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
      identifier: 'cd709647-55bd-404b-ae1a-56904d84be89', // Real Saily identifier from main project
      planType: 'country',
      coveredCountries: ['TH'],
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
      coveredCountries: ['TH', 'SG', 'MY', 'ID', 'PH', 'VN'],
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
      coveredCountries: ['TH', 'SG', 'MY', 'ID', 'PH', 'VN'],
    },
    {
      id: 'th-regional-3',
      name: 'Southeast Asia 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 17.99,
      price: 17.99,
      currency: '$',
      identifier: 'saily_sea_10gb_30d',
      planType: 'regional',
      coveredCountries: ['TH', 'SG', 'MY', 'ID', 'PH', 'VN'],
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
      coveredCountries: ['TH', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'SG', 'MY', 'AU', 'NZ'],
    },
    {
      id: 'th-global-2',
      name: 'Global 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: 'saily_global_3gb_15d',
      planType: 'global',
      coveredCountries: ['TH', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'SG', 'MY', 'AU', 'NZ'],
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
      coveredCountries: ['TH', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'SG', 'MY', 'AU', 'NZ'],
    }
  ],
  'RS': [
    // Country Plans
    {
      id: 'rs-1',
      name: 'Serbia 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 3.99,
      price: 3.99,
      currency: '$',
      identifier: '532eb9b7-a6a7-40e2-88ab-6622d12856dd', // Plan identifier
      priceIdentifier: 'MTpwbHN6MnlZdVFtMkpsS3A0YVY4dTMxYld1LTJZY19mYzd0ejVwM19kSXg4PTpQcmljZToyNzkyLlVTRC4zOTk=', // Price identifier for checkout
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
      identifier: '3e530dbf-e379-4718-a7a7-b7f207b2df18', // Plan identifier
      priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC43OTk=', // Price identifier for checkout
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
      identifier: '5f8a9c2d-4e1b-4a3c-8d7e-9f0a1b2c3d4e', // Plan identifier
      priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xMDk5', // Price identifier for checkout
      planType: 'country',
      coveredCountries: ['RS'],
    },
    {
      id: 'rs-4',
      name: 'Serbia 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: '6g9b0d3e-5f2c-5b4d-9e8f-0a1b2c3d4e5f', // Plan identifier
      priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4xNTk5', // Price identifier for checkout
      planType: 'country',
      coveredCountries: ['RS'],
    },
    {
      id: 'rs-5',
      name: 'Serbia 20GB 30 days',
      data: '20 GB',
      validity: '30 дни',
      priceUSD: 25.99,
      price: 25.99,
      currency: '$',
      identifier: '7h0c1e4f-6g3d-6c5e-0f1g-1b2c3d4e5f6g', // Plan identifier
      priceIdentifier: 'MToxV2xQLUlUUHFPVnJRMUJqV1RSSGhZYVpTQTdSbTZKVzJMdjlsNklhYko0PTpQcmljZToyNzI2LlVTRC4yNTk5', // Price identifier for checkout
      planType: 'country',
      coveredCountries: ['RS'],
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
      coveredCountries: ['RS', 'BG', 'HR', 'BA', 'MK', 'ME', 'AL'],
    },
    {
      id: 'rs-regional-2',
      name: 'Balkans 5GB 15 days',
      data: '5 GB',
      validity: '15 дни',
      priceUSD: 10.99,
      price: 10.99,
      currency: '$',
      identifier: 'saily_balkans_5gb_15d',
      planType: 'regional',
      coveredCountries: ['RS', 'BG', 'HR', 'BA', 'MK', 'ME', 'AL'],
    },
    {
      id: 'rs-regional-3',
      name: 'Balkans 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 16.99,
      price: 16.99,
      currency: '$',
      identifier: 'saily_balkans_10gb_30d',
      planType: 'regional',
      coveredCountries: ['RS', 'BG', 'HR', 'BA', 'MK', 'ME', 'AL'],
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
      coveredCountries: ['RS', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE'],
    },
    {
      id: 'rs-global-2',
      name: 'Global 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: 'saily_global_3gb_15d',
      planType: 'global',
      coveredCountries: ['RS', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE'],
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
      coveredCountries: ['RS', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE'],
    }
  ],
  'AE': [
    // Country Plans
    {
      id: 'ae-1',
      name: 'Dubai 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 8.99,
      price: 8.99,
      currency: '$',
      identifier: 'saily_ae_1gb_7d',
      planType: 'country',
      coveredCountries: ['AE'],
    },
    {
      id: 'ae-2',
      name: 'Dubai 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: 'saily_ae_3gb_15d',
      planType: 'country',
      coveredCountries: ['AE'],
    },
    // Regional Plans (Middle East)
    {
      id: 'ae-regional-1',
      name: 'Middle East 2GB 7 days',
      data: '2 GB',
      validity: '7 дни',
      priceUSD: 10.99,
      price: 10.99,
      currency: '$',
      identifier: 'saily_me_2gb_7d',
      planType: 'regional',
      coveredCountries: ['AE', 'SA', 'QA', 'KW', 'OM', 'BH'],
    },
    {
      id: 'ae-regional-2',
      name: 'Middle East 5GB 15 days',
      data: '5 GB',
      validity: '15 дни',
      priceUSD: 17.99,
      price: 17.99,
      currency: '$',
      identifier: 'saily_me_5gb_15d',
      planType: 'regional',
      coveredCountries: ['AE', 'SA', 'QA', 'KW', 'OM', 'BH'],
    },
    // Global Plans
    {
      id: 'ae-global-1',
      name: 'Global 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 9.99,
      price: 9.99,
      currency: '$',
      identifier: 'saily_global_1gb_7d',
      planType: 'global',
      coveredCountries: ['AE', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
    },
    {
      id: 'ae-global-2',
      name: 'Global 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: 'saily_global_3gb_15d',
      planType: 'global',
      coveredCountries: ['AE', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
    }
  ],
  'EG': [
    // Country Plans
    {
      id: 'eg-1',
      name: 'Egypt 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 6.99,
      price: 6.99,
      currency: '$',
      identifier: 'saily_eg_1gb_7d',
      planType: 'country',
      coveredCountries: ['EG'],
    },
    {
      id: 'eg-2',
      name: 'Egypt 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 12.99,
      price: 12.99,
      currency: '$',
      identifier: 'saily_eg_3gb_15d',
      planType: 'country',
      coveredCountries: ['EG'],
    },
    // Regional Plans (Middle East)
    {
      id: 'eg-regional-1',
      name: 'Middle East 2GB 7 days',
      data: '2 GB',
      validity: '7 дни',
      priceUSD: 9.99,
      price: 9.99,
      currency: '$',
      identifier: 'saily_me_2gb_7d',
      planType: 'regional',
      coveredCountries: ['EG', 'AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'JO', 'LB'],
    },
    {
      id: 'eg-regional-2',
      name: 'Middle East 5GB 15 days',
      data: '5 GB',
      validity: '15 дни',
      priceUSD: 16.99,
      price: 16.99,
      currency: '$',
      identifier: 'saily_me_5gb_15d',
      planType: 'regional',
      coveredCountries: ['EG', 'AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'JO', 'LB'],
    },
    // Global Plans
    {
      id: 'eg-global-1',
      name: 'Global 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 9.99,
      price: 9.99,
      currency: '$',
      identifier: 'saily_global_1gb_7d',
      planType: 'global',
      coveredCountries: ['EG', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
    },
    {
      id: 'eg-global-2',
      name: 'Global 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: 'saily_global_3gb_15d',
      planType: 'global',
      coveredCountries: ['EG', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
    }
  ],
  'US': [
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
      coveredCountries: ['US'],
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
      coveredCountries: ['US'],
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
      coveredCountries: ['US'],
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
      coveredCountries: ['US'],
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
      coveredCountries: ['US', 'CA', 'MX'],
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
      coveredCountries: ['US', 'CA', 'MX'],
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
      coveredCountries: ['US', 'CA', 'MX'],
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
      coveredCountries: ['US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
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
      coveredCountries: ['US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
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
      coveredCountries: ['US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
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
      coveredCountries: ['US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
    }
  ],
  'GB': [
    // Country Plans
    {
      id: 'gb-1',
      name: 'UK 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 7.99,
      price: 7.99,
      currency: '$',
      identifier: 'saily_gb_2gb_15d',
      planType: 'country',
      coveredCountries: ['GB'],
    },
    {
      id: 'gb-2',
      name: 'UK 5GB 15 days',
      data: '5 GB',
      validity: '15 дни',
      priceUSD: 14.99,
      price: 14.99,
      currency: '$',
      identifier: 'saily_gb_5gb_30d',
      planType: 'country',
      coveredCountries: ['GB'],
    },
    // Regional Plans (Europe)
    {
      id: 'gb-regional-1',
      name: 'Europe 2GB 7 days',
      data: '2 GB',
      validity: '7 дни',
      priceUSD: 9.99,
      price: 9.99,
      currency: '$',
      identifier: 'saily_eu_2gb_7d',
      planType: 'regional',
      coveredCountries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR'],
    },
    {
      id: 'gb-regional-2',
      name: 'Europe 5GB 15 days',
      data: '5 GB',
      validity: '15 дни',
      priceUSD: 13.99,
      price: 13.99,
      currency: '$',
      identifier: 'saily_eu_5gb_15d',
      planType: 'regional',
      coveredCountries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR'],
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
      coveredCountries: ['GB', 'US', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
    },
    {
      id: 'gb-global-2',
      name: 'Global 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: 'saily_global_3gb_15d',
      planType: 'global',
      coveredCountries: ['GB', 'US', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'TH', 'SG', 'MY', 'AU', 'NZ'],
    }
  ],
  'TR': [
    // Country Plans
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
      coveredCountries: ['TR'],
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
      coveredCountries: ['TR'],
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
      coveredCountries: ['TR'],
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
      coveredCountries: ['TR'],
    },
    // Regional Plans (Europe/Balkans)
    {
      id: 'tr-regional-1',
      name: 'Europe 2GB 7 days',
      data: '2 GB',
      validity: '7 дни',
      priceUSD: 8.99,
      price: 8.99,
      currency: '$',
      identifier: 'saily_eu_2gb_7d',
      planType: 'regional',
      coveredCountries: ['TR', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR'],
    },
    {
      id: 'tr-regional-2',
      name: 'Europe 5GB 15 days',
      data: '5 GB',
      validity: '15 дни',
      priceUSD: 12.99,
      price: 12.99,
      currency: '$',
      identifier: 'saily_eu_5gb_15d',
      planType: 'regional',
      coveredCountries: ['TR', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR'],
    },
    // Global Plans
    {
      id: 'tr-global-1',
      name: 'Global 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 9.99,
      price: 9.99,
      currency: '$',
      identifier: 'saily_global_1gb_7d',
      planType: 'global',
      coveredCountries: ['TR', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE'],
    },
    {
      id: 'tr-global-2',
      name: 'Global 3GB 15 days',
      data: '3 GB',
      validity: '15 дни',
      priceUSD: 15.99,
      price: 15.99,
      currency: '$',
      identifier: 'saily_global_3gb_15d',
      planType: 'global',
      coveredCountries: ['TR', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'GR', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE'],
    }
  ]
};
