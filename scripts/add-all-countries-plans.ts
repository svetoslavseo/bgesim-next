/**
 * Fetch and add all available plans for all countries
 */

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

interface SailyPlan {
  covered_countries: string[];
  data_limit: { amount: number; is_unlimited: boolean; type: string; unit: string };
  duration: { amount: number; unit: string };
  identifier: string;
  is_unlimited: boolean;
  name: string;
  price: { amount_with_tax: number; currency: string; identifier: string };
}

const COUNTRIES: { code: string; name: string; section: string }[] = [
  { code: 'TH', name: 'Thailand', section: 'Thailand (TH)' },
  { code: 'TR', name: 'Turkey', section: 'Turkey (TR)' },
  { code: 'AE', name: 'Dubai/UAE', section: 'Dubai (AE)' },
  { code: 'EG', name: 'Egypt', section: 'Egypt (EG)' },
  { code: 'US', name: 'USA', section: 'USA (US)' },
  { code: 'GB', name: 'UK', section: 'UK (GB)' },
];

async function main() {
  const response = await fetch(API_URL, {
    headers: {
      'x-api-key': API_KEY,
      'x-partner-id': PARTNER_ID,
      'Accept': 'application/json',
    },
  });

  const data = await response.json();
  const allPlans: SailyPlan[] = data.items;

  console.log('// AUTO-GENERATED CODE FOR ALL COUNTRIES\n');

  for (const country of COUNTRIES) {
    console.log(`\n// ===== ${country.section} =====\n`);
    
    const plans = allPlans
      .filter(p => {
        if (!p.is_unlimited && p.data_limit.amount > 100) return false;
        return p.covered_countries.includes(country.code);
      })
      .map(p => ({
        ...p,
        type: p.covered_countries.length === 1 ? 'country' : 
              p.covered_countries.length <= 15 ? 'regional' : 'global'
      }));

    const countryPlans = plans.filter(p => p.type === 'country');
    const regionalPlans = plans.filter(p => p.type === 'regional');
    const globalPlans = plans.filter(p => p.type === 'global');

    // Only show regional and global plans (country plans already exist)
    if (regionalPlans.length > 0) {
      console.log(`// Regional Plans - Real data from Saily API`);
      regionalPlans.forEach((plan, idx) => {
        const covered = country.code === 'US' ? 'US, CA, MX' : plan.covered_countries.join(', ');
        console.log(`    {
      id: '${country.code.toLowerCase()}-regional-${idx + 1}',
      name: '${plan.name}',
      data: '${plan.data_limit.amount} ${plan.data_limit.unit.toUpperCase()}',
      validity: '${plan.duration.amount} дни',
      priceUSD: ${(plan.price.amount_with_tax / 100).toFixed(2)},
      price: ${(plan.price.amount_with_tax / 100).toFixed(2)},
      currency: '$',
      identifier: '${plan.identifier}',
      priceIdentifier: '${plan.price.identifier}',
      planType: 'regional',
      coveredCountries: [${covered.split(', ').map(c => `'${c}'`).join(', ')}],
    },`);
      });
    }

    if (globalPlans.length > 0) {
      console.log(`\n    // Global Plans - Real data from Saily API`);
      globalPlans.forEach((plan, idx) => {
        const covered = plan.covered_countries.join(', ');
        console.log(`    {
      id: '${country.code.toLowerCase()}-global-${idx + 1}',
      name: '${plan.name}',
      data: '${plan.data_limit.amount} ${plan.data_limit.unit.toUpperCase()}',
      validity: '${plan.duration.amount} дни',
      priceUSD: ${(plan.price.amount_with_tax / 100).toFixed(2)},
      price: ${(plan.price.amount_with_tax / 100).toFixed(2)},
      currency: '$',
      identifier: '${plan.identifier}',
      priceIdentifier: '${plan.price.identifier}',
      planType: 'global',
      coveredCountries: [${covered.split(', ').map(c => `'${c}'`).join(', ')}],
    },`);
      });
    }

    console.log(`    // Total: ${regionalPlans.length} regional, ${globalPlans.length} global plans`);
  }
}

main();

