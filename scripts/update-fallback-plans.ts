/**
 * Automated script to fetch plans from Saily API
 * Updates fallback-plans.json as a backup when the API is unavailable
 * This script is designed to run every 2 days to keep fallback plans current
 * 
 * Note: The primary data source is the Saily API. fallback-plans.json is only
 * used when the API fails (e.g., Cloudflare protection blocking requests).
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

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

interface ProcessedPlan {
  id: string;
  name: string;
  data: string;
  validity: string;
  priceUSD: number;
  price: number;
  currency: string;
  identifier: string;
  priceIdentifier: string;
  planType: 'global' | 'regional' | 'country';
  coveredCountries: string[];
}

// Countries we support - expanded list
const COUNTRIES: Record<string, { name: string; searchName: string }> = {
  'RS': { name: 'Serbia', searchName: 'serbia' },
  'TH': { name: 'Thailand', searchName: 'thailand' },
  'TR': { name: 'Turkey', searchName: 'turkey' },
  'AE': { name: 'Dubai', searchName: 'united arab emirates' },
  'EG': { name: 'Egypt', searchName: 'egypt' },
  'US': { name: 'USA', searchName: 'united states' },
  'GB': { name: 'UK', searchName: 'united kingdom' },
  'MA': { name: 'Morocco', searchName: 'morocco' },
  'ID': { name: 'Indonesia', searchName: 'indonesia' },
};

async function fetchSailyPlans(): Promise<SailyPlan[]> {
  console.log('🔄 Fetching plans from Saily API...');
  
  // Add utm_source parameter to API URL
  const url = new URL(API_URL);
  url.searchParams.set('utm_source', 'travelesim');
  
  const response = await fetch(url.toString(), {
    headers: {
      'x-api-key': API_KEY,
      'x-partner-id': PARTNER_ID,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.items.length} plans from Saily API\n`);
  
  return data.items;
}

function getPlansForCountry(plans: SailyPlan[], countryCode: string, searchName: string): ProcessedPlan[] {
  // Filter out unrealistic plans (>100GB)
  const filteredPlans = plans.filter(plan => {
    if (!plan.is_unlimited && plan.data_limit.amount > 100) {
      console.log(`   ⚠️  Filtering out unrealistic plan: ${plan.name} (${plan.data_limit.amount} ${plan.data_limit.unit})`);
      return false;
    }
    return true;
  });

  // Find plans that cover this country
  const countryPlans = filteredPlans
    .filter(plan => {
      const coversCountry = plan.covered_countries.includes(countryCode);
      const nameMatches = plan.name.toLowerCase().includes(searchName.toLowerCase());
      return coversCountry || nameMatches;
    })
    .map(plan => {
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

  return countryPlans;
}

async function updateFallbackPlans(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Saily Plans Auto-Update Script                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    const allPlans = await fetchSailyPlans();
    const fallbackPlans: Record<string, ProcessedPlan[]> = {};
    
    let totalPlans = 0;
    
    for (const [countryCode, countryInfo] of Object.entries(COUNTRIES)) {
      console.log(`\n🌍 Processing ${countryInfo.name} (${countryCode})...`);
      
      const plans = getPlansForCountry(allPlans, countryCode, countryInfo.searchName);
      
      // Separate by plan type
      const countryPlans = plans.filter(p => p.planType === 'country');
      const regionalPlans = plans.filter(p => p.planType === 'regional');
      const globalPlans = plans.filter(p => p.planType === 'global');
      
      // Prioritize country plans, then regional, then global (limit global to 3)
      const plansToSave: ProcessedPlan[] = [];
      
      // Add country plans
      plansToSave.push(...countryPlans);
      
      // Add unique regional plans
      const uniqueRegional = Array.from(new Map(regionalPlans.map(p => [p.name, p])).values());
      plansToSave.push(...uniqueRegional);
      
      // Add top 3 global plans (if any)
      if (globalPlans.length > 0) {
        const uniqueGlobal = Array.from(new Map(globalPlans.map(p => [p.name, p])).values());
        plansToSave.push(...uniqueGlobal.slice(0, 3));
      }
      
      if (plansToSave.length > 0) {
        fallbackPlans[countryCode] = plansToSave;
        totalPlans += plansToSave.length;
        console.log(`   ✅ Found ${plansToSave.length} plans (${countryPlans.length} country, ${uniqueRegional.length} regional, ${Math.min(globalPlans.length, 3)} global)`);
      } else {
        console.log(`   ⚠️  No plans found for ${countryInfo.name}`);
      }
    }
    
    // Write to fallback-plans.json
    const outputPath = path.join(process.cwd(), 'fallback-plans.json');
    fs.writeFileSync(outputPath, JSON.stringify(fallbackPlans, null, 2), 'utf8');
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ Successfully updated fallback plans backup file');
    console.log(`   File: ${outputPath}`);
    console.log(`   Countries: ${Object.keys(fallbackPlans).length}`);
    console.log(`   Total plans: ${totalPlans}`);
    console.log(`   Updated at: ${new Date().toISOString()}`);
    console.log('   Note: Primary data source is Saily API. This file is used as fallback only.');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error updating fallback plans:', error);
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    }
    process.exit(1);
  }
}

// Run the update
updateFallbackPlans();

