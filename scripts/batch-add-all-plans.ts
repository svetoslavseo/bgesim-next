/**
 * Batch script to add all plans for all countries at once
 */

import * as fs from 'fs';
import * as path from 'path';

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

const COUNTRIES = [
  { code: 'TR', name: 'Turkey', section: 'Turkey (TR)' },
  { code: 'AE', name: 'Dubai', section: 'Dubai (AE)' },
  { code: 'EG', name: 'Egypt', section: 'Egypt (EG)' },
  { code: 'US', name: 'USA', section: 'USA (US)' },
  { code: 'GB', name: 'UK', section: 'UK (GB)' },
];

async function main() {
  console.log('Fetching plans from Saily API...');
  
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

  const data = await response.json();
  const allPlans: SailyPlan[] = data.items;

  const filePath = path.join(__dirname, '../src/lib/sailyApi.ts');
  let fileContent = fs.readFileSync(filePath, 'utf8');

  for (const country of COUNTRIES) {
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

    const regionalPlans = plans.filter(p => p.type === 'regional');
    const globalPlans = plans.filter(p => p.type === 'global');

    // Find the insertion point after the last country plan
    const countrySectionRegex = new RegExp(`'${country.code}':\\s*\\[[^\\]]*\\],`);
    const match = fileContent.match(countrySectionRegex);
    
    if (match) {
      const insertionPoint = match.index! + match[0].length;
      let codeToInsert = '';

      // Add regional plans if any
      if (regionalPlans.length > 0) {
        codeToInsert += '\n    // Regional Plans - Real data from Saily API\n';
        regionalPlans.forEach((plan, idx) => {
          const covered = country.code === 'US' ? 'US, CA, MX' : plan.covered_countries.join(', ');
          codeToInsert += `    {
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
    },\n`;
        });
      }

      // Add global plans if any
      if (globalPlans.length > 0) {
        codeToInsert += '\n    // Global Plans - Real data from Saily API\n';
        globalPlans.slice(0, 10).forEach((plan, idx) => {
          const covered = plan.covered_countries.slice(0, 50).join(', ');
          codeToInsert += `    {
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
    },\n`;
        });
      }

      // Insert before the closing bracket of the array
      const beforeBracket = fileContent.substring(0, insertionPoint - 1);
      const afterBracket = fileContent.substring(insertionPoint - 1);
      
      fileContent = beforeBracket + codeToInsert + '  ],';
    }
  }

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log('✅ Updated sailyApi.ts with all global and regional plans');
}

main();

