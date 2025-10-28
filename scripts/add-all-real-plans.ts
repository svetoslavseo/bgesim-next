/**
 * Add all REAL regional and global plans for ALL countries
 */

import fs from 'fs';

const COUNTRIES = {
  'RS': { name: 'Serbia', code: 'RS' },
  'TH': { name: 'Thailand', code: 'TH' },
  'TR': { name: 'Turkey', code: 'TR' },
  'AE': { name: 'Dubai', code: 'AE' },
  'EG': { name: 'Egypt', code: 'EG' },
  'US': { name: 'USA', code: 'US' },
  'GB': { name: 'UK', code: 'GB' }
};

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

async function fetchPlans() {
  const response = await fetch(API_URL, {
    headers: {
      'x-api-key': API_KEY,
      'x-partner-id': PARTNER_ID,
      'Accept': 'application/json',
    },
  });

  return (await response.json()).items;
}

function categorizePlan(plan: any, countryCode: string) {
  if (!plan.is_unlimited && plan.data_limit.amount > 100) return null;
  
  const covers = plan.covered_countries.includes(countryCode);
  const count = plan.covered_countries.length;

  if (count === 1 && covers) return 'country';
  if (count > 1 && count <= 15 && covers) return 'regional';
  if (count > 15 && covers) return 'global';
  return null;
}

async function main() {
  console.log('Fetching plans from Saily API...');
  const allPlans = await fetchPlans();
  console.log(`✅ Fetched ${allPlans.length} plans\n`);

  for (const [code, info] of Object.entries(COUNTRIES)) {
    const plans = allPlans
      .map(p => ({ plan: p, type: categorizePlan(p, code) }))
      .filter(({ type }) => type !== null);

    const countryPlans = plans.filter(({ type }) => type === 'country');
    const regionalPlans = plans.filter(({ type }) => type === 'regional');
    const globalPlans = plans.filter(({ type }) => type === 'global');

    console.log(`${info.name} (${code}):`);
    console.log(`  Country: ${countryPlans.length}`);
    console.log(`  Regional: ${regionalPlans.length}`);
    console.log(`  Global: ${globalPlans.length}\n`);
  }
}

main();

