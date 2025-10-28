/**
 * Script to add REAL regional and global plans from Saily API
 * Only includes plans that actually exist in the Saily API
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

async function fetchSailyPlans(): Promise<SailyPlan[]> {
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
  return data.items;
}

function categorizePlans(plans: SailyPlan[], countryCode: string): {
  country: SailyPlan[];
  regional: SailyPlan[];
  global: SailyPlan[];
} {
  const country: SailyPlan[] = [];
  const regional: SailyPlan[] = [];
  const global: SailyPlan[] = [];

  plans.forEach(plan => {
    // Skip unrealistic plans (999 GB)
    if (!plan.is_unlimited && plan.data_limit.amount > 100) {
      return;
    }

    const covers = plan.covered_countries.includes(countryCode);
    const count = plan.covered_countries.length;

    if (count === 1 && covers) {
      country.push(plan);
    } else if (count > 1 && count <= 10 && covers) {
      regional.push(plan);
    } else if (count > 10 && covers) {
      global.push(plan);
    }
  });

  return { country, regional, global };
}

function generateCode(plan: SailyPlan, index: number, planType: 'country' | 'regional' | 'global'): string {
  const priceUSD = plan.price.amount_with_tax / 100;
  const uuid = crypto.randomUUID().replace(/-/g, '-');
  const planTypePrefix = planType === 'country' ? '' : `-${planType}`;
  
  return `    {
      id: '${uuid}',
      name: '${plan.name}',
      data: '${plan.is_unlimited ? 'Unlimited' : `${plan.data_limit.amount} ${plan.data_limit.unit}`}',
      validity: '${plan.duration.amount} ${plan.duration.unit === 'day' ? 'дни' : plan.duration.unit}',
      priceUSD: ${priceUSD},
      price: ${priceUSD},
      currency: '$',
      identifier: '${plan.identifier}',
      priceIdentifier: '${plan.price.identifier}',
      planType: '${planType}',
      coveredCountries: ${JSON.stringify(plan.covered_countries)},
    }`;
}

async function main() {
  console.log('🔄 Fetching plans from Saily API...');
  const allPlans = await fetchSailyPlans();
  console.log(`✅ Fetched ${allPlans.length} total plans\n`);

  const countries = {
    'RS': 'Serbia',
    'TH': 'Thailand',
    'TR': 'Turkey',
    'AE': 'Dubai',
    'EG': 'Egypt',
    'US': 'USA',
    'GB': 'UK'
  };

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  REAL REGIONAL & GLOBAL PLANS - By Country                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  for (const [code, name] of Object.entries(countries)) {
    const categorized = categorizePlans(allPlans, code);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌍 ${name} (${code})`);
    console.log('='.repeat(60));
    console.log(`✅ Country Plans: ${categorized.country.length}`);
    console.log(`🌐 Regional Plans: ${categorized.regional.length}`);
    console.log(`🌎 Global Plans: ${categorized.global.length}`);
    console.log(`   Total: ${categorized.country.length + categorized.regional.length + categorized.global.length}`);

    if (categorized.regional.length > 0) {
      console.log(`\n📋 Regional Plans (that cover ${name}):`);
      categorized.regional.slice(0, 3).forEach(p => {
        const price = p.price.amount_with_tax / 100;
        console.log(`   • ${p.name}: $${price} (${p.data_limit.amount} ${p.data_limit.unit})`);
      });
    }

    if (categorized.global.length > 0) {
      console.log(`\n📋 Global Plans (that cover ${name}):`);
      categorized.global.slice(0, 3).forEach(p => {
        const price = p.price.amount_with_tax / 100;
        console.log(`   • ${p.name}: $${price} (${p.data_limit.amount} ${p.data_limit.unit})`);
      });
    }

    // Generate code for additional plans
    if (categorized.regional.length > 0 || categorized.global.length > 0) {
      console.log(`\n📝 Additional Plans to Add:`);
      
      if (categorized.regional.length > 0) {
        console.log(`\n  // Regional Plans - Real data from Saily API`);
        categorized.regional.slice(0, 3).forEach((plan, idx) => {
          console.log(generateCode(plan, idx, 'regional') + ',');
        });
      }

      if (categorized.global.length > 0) {
        console.log(`\n  // Global Plans - Real data from Saily API`);
        categorized.global.slice(0, 3).forEach((plan, idx) => {
          console.log(generateCode(plan, idx, 'global') + ',');
        });
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Analysis complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);

