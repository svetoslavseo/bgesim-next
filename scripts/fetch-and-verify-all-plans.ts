/**
 * Script to fetch real Saily API data for all countries
 * and verify pricing across all country pages
 */

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

// Countries we support
const COUNTRIES = {
  'RS': { name: 'Serbia', searchName: 'serbia' },
  'TH': { name: 'Thailand', searchName: 'thailand' },
  'TR': { name: 'Turkey', searchName: 'turkey' },
  'AE': { name: 'Dubai', searchName: 'united arab emirates' },
  'EG': { name: 'Egypt', searchName: 'egypt' },
  'US': { name: 'USA', searchName: 'united states' },
  'GB': { name: 'UK', searchName: 'united kingdom' }
};

async function fetchSailyPlans(): Promise<SailyPlan[]> {
  console.log('🔄 Fetching plans from Saily API...');
  
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

  const data = await response.json();
  console.log(`✅ Fetched ${data.items.length} plans from Saily API\n`);
  
  return data.items;
}

function getPlansForCountry(plans: SailyPlan[], countryCode: string, searchName: string): ProcessedPlan[] {
  // Filter out unrealistic plans (999 GB "unlimited" plans)
  const filteredPlans = plans.filter(plan => {
    if (!plan.is_unlimited && plan.data_limit.amount > 100) {
      return false;
    }
    return true;
  });

  // Find plans that cover this country
  const countryPlans = filteredPlans
    .filter(plan => {
      const coversCountry = plan.covered_countries.includes(countryCode);
      const nameMatches = plan.name.toLowerCase().includes(searchName);
      return coversCountry || nameMatches;
    })
    .map(plan => {
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

  return countryPlans;
}

function generatePlanCode(plan: ProcessedPlan, countryCode: string, index: number): string {
  const planType = plan.planType === 'country' ? '' : `-${plan.planType}`;
  return `    {
      id: '${countryCode.toLowerCase()}${planType}-${index + 1}',
      name: '${plan.name}',
      data: '${plan.data}',
      validity: '${plan.validity}',
      priceUSD: ${plan.priceUSD},
      price: ${plan.price},
      currency: '$',
      identifier: '${plan.identifier}',
      priceIdentifier: '${plan.priceIdentifier}',
      planType: '${plan.planType}',
      coveredCountries: ${JSON.stringify(plan.coveredCountries)},
    }`;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Saily API Data Fetcher & Verification Tool                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    const allPlans = await fetchSailyPlans();
    
    for (const [countryCode, countryInfo] of Object.entries(COUNTRIES)) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🌍 ${countryInfo.name} (${countryCode})`);
      console.log('='.repeat(60));
      
      const plans = getPlansForCountry(allPlans, countryCode, countryInfo.searchName);
      
      // Separate by plan type
      const countryPlans = plans.filter(p => p.planType === 'country');
      const regionalPlans = plans.filter(p => p.planType === 'regional');
      const globalPlans = plans.filter(p => p.planType === 'global');
      
      console.log(`\n📊 Plan Summary:`);
      console.log(`   Country Plans: ${countryPlans.length}`);
      console.log(`   Regional Plans: ${regionalPlans.length}`);
      console.log(`   Global Plans: ${globalPlans.length}`);
      console.log(`   Total: ${plans.length}`);
      
      if (countryPlans.length > 0) {
        console.log(`\n🏴 Country Plans for ${countryInfo.name}:`);
        countryPlans.forEach(plan => {
          console.log(`   • ${plan.name}: $${plan.priceUSD} (${plan.data})`);
        });
      }
      
      if (regionalPlans.length > 0) {
        console.log(`\n🌐 Regional Plans covering ${countryInfo.name}:`);
        const uniqueRegional = Array.from(new Set(regionalPlans.map(p => p.name)))
          .map(name => regionalPlans.find(p => p.name === name)!);
        uniqueRegional.forEach(plan => {
          console.log(`   • ${plan.name}: $${plan.priceUSD} (${plan.data})`);
        });
      }
      
      // Generate TypeScript code
      console.log(`\n📝 Generated Code for FALLBACK_PLANS['${countryCode}']:`);
      console.log(`\n  '${countryCode}': [`);
      
      if (countryPlans.length > 0) {
        console.log(`    // Country Plans - Real data from Saily API`);
        countryPlans.forEach((plan, index) => {
          console.log(generatePlanCode(plan, countryCode, index) + ',');
        });
      }
      
      if (regionalPlans.length > 0) {
        console.log(`    // Regional Plans`);
        const uniqueRegional = Array.from(new Set(regionalPlans.map(p => p.name)))
          .map(name => regionalPlans.find(p => p.name === name)!);
        uniqueRegional.forEach((plan, index) => {
          console.log(generatePlanCode(plan, countryCode, countryPlans.length + index) + ',');
        });
      }
      
      if (globalPlans.length > 0 && globalPlans.length <= 5) {
        console.log(`    // Global Plans`);
        globalPlans.slice(0, 3).forEach((plan, index) => {
          console.log(generatePlanCode(plan, countryCode, countryPlans.length + regionalPlans.length + index) + ',');
        });
      }
      
      console.log(`  ],`);
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ Completed successfully!');
    console.log('='.repeat(60));
    console.log('\n💡 Next steps:');
    console.log('   1. Copy the generated code above');
    console.log('   2. Update src/lib/sailyApi.ts FALLBACK_PLANS');
    console.log('   3. Test all country pages');
    console.log('   4. Commit and push changes\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

