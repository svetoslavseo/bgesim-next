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

export interface ProcessedPlan {
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

// Import fallback plans from JSON file
import fallbackPlansData from '../../fallback-plans.json';

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

export async function fetchSailyPlans(countryCode?: string): Promise<ProcessedPlan[]> {
  try {
    // Add utm_source parameter to API URL
    const url = new URL(API_URL);
    url.searchParams.set('utm_source', 'travelesim');
    
    console.log('Making Saily API request to:', url.toString());
    console.log('API Key:', API_KEY.substring(0, 10) + '...');
    console.log('Partner ID:', PARTNER_ID);
    
    const response = await fetch(url.toString(), {
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
          priceUSD, // Store original USD price
          price: priceUSD, // Default price (will be converted in component)
          currency: '$',
          identifier: plan.identifier,
          priceIdentifier: plan.price.identifier, // Add price identifier
          planType,
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
    'MA': 'morocco',
    'US': 'usa',
    'GB': 'uk',
    'TR': 'turkey',
    'ID': 'indonesia'
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
 * Generate a Saily checkout URL for a country using the lowest price plan
 * This is used for general country page CTAs where a specific plan isn't selected
 */
export async function generateCountryCheckoutUrl(countryCode: string): Promise<string> {
  try {
    // Get plans for the country
    const plans = await fetchSailyPlans(countryCode);
    
    // Filter country-specific plans (prefer country plans over regional/global)
    const countryPlans = plans.filter(plan => plan.planType === 'country');
    
    // Get the lowest price plan
    const plansToUse = countryPlans.length > 0 ? countryPlans : plans;
    if (plansToUse.length === 0) {
      // Fallback to FALLBACK_PLANS
      const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
      if (fallbackPlans.length > 0) {
        const lowestPricePlan = fallbackPlans.reduce((lowest, plan) => 
          plan.priceUSD < lowest.priceUSD ? plan : lowest
        );
        return generateAffiliateLink(lowestPricePlan);
      }
      throw new Error(`No plans found for country ${countryCode}`);
    }
    
    // Find the lowest price plan
    const lowestPricePlan = plansToUse.reduce((lowest, plan) => 
      plan.priceUSD < lowest.priceUSD ? plan : lowest
    );
    
    return generateAffiliateLink(lowestPricePlan);
  } catch (error) {
    console.error(`Error generating checkout URL for ${countryCode}:`, error);
    // Fallback to FALLBACK_PLANS
    const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
    if (fallbackPlans.length > 0) {
      const lowestPricePlan = fallbackPlans.reduce((lowest, plan) => 
        plan.priceUSD < lowest.priceUSD ? plan : lowest
      );
      return generateAffiliateLink(lowestPricePlan);
    }
    // Last resort: return a generic Saily URL
    throw new Error(`Unable to generate checkout URL for ${countryCode}`);
  }
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

/**
 * Get the lowest price in BGN for a country, considering ONLY country-specific plans
 */
export async function getLowestCountryPriceInBGN(countryCode: string): Promise<number> {
  const { lowPrice } = await getPriceRangeInBGNForCountryPlans(countryCode);
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

/**
 * Get price range (BGN) using ONLY country-specific plans; if none exist, falls back to all
 */
export async function getPriceRangeInBGNForCountryPlans(countryCode: string): Promise<{ lowPrice: number; highPrice: number; offerCount: number }> {
  try {
    const plans = await fetchSailyPlans(countryCode);
    if (plans && plans.length > 0) {
      const countryPlans = plans.filter(p => p.planType === 'country');
      const plansToUse = countryPlans.length > 0 ? countryPlans : plans;
      const pricesInBGN = plansToUse.map(plan => Math.round(plan.priceUSD * 1.8));
      const lowPrice = Math.min(...pricesInBGN);
      const highPrice = Math.max(...pricesInBGN);
      const offerCount = plansToUse.length;
      console.log(`Country-only price range for ${countryCode}: ${offerCount} offers, low: ${lowPrice}лв, high: ${highPrice}лв`);
      return { lowPrice, highPrice, offerCount };
    }
  } catch (error) {
    console.error('Error fetching plans for country-only price calculation:', error);
  }

  // Fallback: use any static plans available for the country code
  const fallbackPlans = (FALLBACK_PLANS[countryCode] || []).filter(p => p.planType === 'country');
  if (fallbackPlans.length === 0) {
    return getPriceRangeInBGN(countryCode);
  }
  const pricesInBGN = fallbackPlans.map(plan => Math.round(plan.priceUSD * 1.8));
  const lowPrice = Math.min(...pricesInBGN);
  const highPrice = Math.max(...pricesInBGN);
  const offerCount = fallbackPlans.length;
  return { lowPrice, highPrice, offerCount };
}

// Fallback static plans loaded from fallback-plans.json
// All prices in USD for consistent conversion
export const FALLBACK_PLANS: Record<string, ProcessedPlan[]> = fallbackPlansData as Record<string, ProcessedPlan[]>;
