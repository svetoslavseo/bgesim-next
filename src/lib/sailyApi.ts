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
  planType: 'global' | 'regional' | 'country';
  ctaUrl?: string;
}

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

export async function fetchSailyPlans(): Promise<ProcessedPlan[]> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'x-api-key': API_KEY,
        'x-partner-id': PARTNER_ID,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: SailyApiResponse = await response.json();
    
    return data.items.map(plan => {
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
        planType: plan.covered_countries.length > 10 ? 'global' : 
                  plan.covered_countries.length > 1 ? 'regional' : 'country',
      };
    });
  } catch (error) {
    console.error('Error fetching Saily plans:', error);
    throw error;
  }
}

export function getPlansForCountry(plans: ProcessedPlan[], countryCode: string): ProcessedPlan[] {
  // Filter plans that cover the specific country
  return plans.filter(plan => {
    // This is a simplified version - in production you'd need proper country code mapping
    // For now, we'll use name matching as a fallback
    const countryName = getCountryNameFromCode(countryCode);
    return plan.name.toLowerCase().includes(countryName.toLowerCase()) ||
           plan.planType === 'global';
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
  const sailyCheckoutUrl = `https://saily.com/checkout/?planId=${plan.identifier}&aff_transaction_id={transaction_id}&aff_offer_id={offer_id}&aff_id={aff_id}`;
  return `https://go.saily.site/aff_c?offer_id=101&aff_id=8080&url=${encodeURIComponent(sailyCheckoutUrl)}`;
}

// Fallback static plans for each country (all prices in USD for consistent conversion)
export const FALLBACK_PLANS: Record<string, ProcessedPlan[]> = {
  'TH': [
    {
      id: 'th-1',
      name: 'Thailand 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 5.99,
      price: 5.99,
      currency: '$',
      identifier: 'saily_th_1gb_7d',
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
      identifier: 'saily_th_3gb_15d',
      planType: 'country',
    },
    {
      id: 'th-3',
      name: 'Thailand 5GB 30 days',
      data: '5 GB',
      validity: '30 дни',
      priceUSD: 19.99,
      price: 19.99,
      currency: '$',
      identifier: 'saily_th_5gb_30d',
      planType: 'country',
    }
  ],
  'RS': [
    {
      id: 'rs-1',
      name: 'Serbia 2GB 15 days',
      data: '2 GB',
      validity: '15 дни',
      priceUSD: 14.44, // Converted from 26 BGN
      price: 14.44,
      currency: '$',
      identifier: 'saily_rs_2gb_15d',
      planType: 'country',
    },
    {
      id: 'rs-2',
      name: 'Serbia Unlimited 1 day',
      data: 'Unlimited',
      validity: '1 ден',
      priceUSD: 11.11, // Converted from 20 BGN
      price: 11.11,
      currency: '$',
      identifier: 'saily_rs_unlimited_1d',
      planType: 'country',
    },
    {
      id: 'rs-3',
      name: 'Serbia Unlimited 5 days',
      data: 'Unlimited',
      validity: '5 дни',
      priceUSD: 41.11, // Converted from 74 BGN
      price: 41.11,
      currency: '$',
      identifier: 'saily_rs_unlimited_5d',
      planType: 'country',
    }
  ],
  'AE': [
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
    }
  ],
  'EG': [
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
    }
  ],
  'US': [
    {
      id: 'us-1',
      name: 'USA 2GB 15 days',
      data: '2 GB',
      validity: '15 дни',
      priceUSD: 9.99,
      price: 9.99,
      currency: '$',
      identifier: 'saily_us_2gb_15d',
      planType: 'country',
    },
    {
      id: 'us-2',
      name: 'USA 10GB 30 days',
      data: '10 GB',
      validity: '30 дни',
      priceUSD: 19.99,
      price: 19.99,
      currency: '$',
      identifier: 'saily_us_10gb_30d',
      planType: 'country',
    }
  ],
  'GB': [
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
    }
  ],
  'TR': [
    {
      id: 'tr-1',
      name: 'Turkey 1GB 7 days',
      data: '1 GB',
      validity: '7 дни',
      priceUSD: 4.99,
      price: 4.99,
      currency: '$',
      identifier: 'saily_tr_1gb_7d',
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
      planType: 'country',
    }
  ]
};
