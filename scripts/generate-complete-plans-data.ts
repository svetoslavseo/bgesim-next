/**
 * Generate complete plan data for all countries with real Saily API data
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

const COUNTRIES = ['RS', 'TH', 'TR', 'AE', 'EG', 'US', 'GB'];

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

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  COMPLETE PLAN DATA - All Countries                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  for (const code of COUNTRIES) {
    const plans = allPlans
      .filter(p => {
        if (!p.is_unlimited && p.data_limit.amount > 100) return false;
        return p.covered_countries.includes(code);
      })
      .map(p => ({
        ...p,
        type: p.covered_countries.length === 1 ? 'country' : 
              p.covered_countries.length <= 15 ? 'regional' : 'global'
      }));

    const country = plans.filter(p => p.type === 'country');
    const regional = plans.filter(p => p.type === 'regional');
    const global = plans.filter(p => p.type === 'global');

    console.log(`${code}: Country: ${country.length}, Regional: ${regional.length}, Global: ${global.length}`);
    
    if (regional.length > 0) {
      console.log('  Regional:', regional.map(p => p.name).join(', '));
    }
  }
}

main();

