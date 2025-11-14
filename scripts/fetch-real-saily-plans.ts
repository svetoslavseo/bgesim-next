/**
 * Script to fetch real plans from Saily API and generate fallback plans with priceIdentifiers
 */

const API_KEY = 'a820596678ad38f13bad61d1648f1befef597d0b8659648f4cf8b337fd6cb513';
const PARTNER_ID = 'atlasvpn';
const API_URL = 'https://web.saily.com/v2/partners/plans';

const COUNTRIES = {
  'EG': 'Egypt',
  'US': 'USA',
  'GB': 'UK',
  'TR': 'Turkey',
  'TH': 'Thailand',
  'RS': 'Serbia',
  'AE': 'Dubai',
  'ID': 'Indonesia'
};

async function fetchSailyPlans() {
  try {
    console.log('Fetching plans from Saily API...\n');
    
    const response = await fetch(API_URL, {
      method: 'GET',
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
    console.log(`Total plans from API: ${data.items.length}\n`);

    // Group plans by country
    for (const [countryCode, countryName] of Object.entries(COUNTRIES)) {
      console.log(`\n=== ${countryName} (${countryCode}) ===`);
      
      const countryPlans = data.items
        .filter((plan: any) => {
          // Filter for country-specific plans
          const coversCountry = plan.covered_countries.includes(countryCode);
          const nameContainsCountry = plan.name.toLowerCase().includes(countryName.toLowerCase());
          const isCountrySpecific = plan.covered_countries.length === 1 && coversCountry;
          
          return isCountrySpecific || (coversCountry && nameContainsCountry && plan.covered_countries.length <= 3);
        })
        .filter((plan: any) => !plan.is_unlimited && plan.data_limit.amount <= 100)
        .sort((a: any, b: any) => {
          // Sort by duration, then by data amount
          if (a.duration.amount !== b.duration.amount) {
            return a.duration.amount - b.duration.amount;
          }
          return a.data_limit.amount - b.data_limit.amount;
        });

      console.log(`Found ${countryPlans.length} plans:`);
      
      countryPlans.forEach((plan: any) => {
        const priceUSD = (plan.price.amount_with_tax / 100).toFixed(2);
        console.log(`  - ${plan.data_limit.amount}${plan.data_limit.unit} / ${plan.duration.amount} days - $${priceUSD}`);
        console.log(`    identifier: ${plan.identifier}`);
        console.log(`    priceIdentifier: ${plan.price.identifier}`);
        console.log(`    covered_countries: ${plan.covered_countries.join(', ')}`);
      });

      // Generate TypeScript code
      console.log(`\n  TypeScript code for FALLBACK_PLANS:`);
      console.log(`  '${countryCode}': [`);
      countryPlans.forEach((plan: any, index: number) => {
        const priceUSD = (plan.price.amount_with_tax / 100);
        const dataAmount = plan.data_limit.amount;
        const dataUnit = plan.data_limit.unit.toUpperCase();
        const duration = plan.duration.amount;
        
        console.log(`    {`);
        console.log(`      id: '${countryCode.toLowerCase()}-${index + 1}',`);
        console.log(`      name: '${countryName} ${dataAmount}${dataUnit} ${duration} days',`);
        console.log(`      data: '${dataAmount} ${dataUnit}',`);
        console.log(`      validity: '${duration} дни',`);
        console.log(`      priceUSD: ${priceUSD},`);
        console.log(`      price: ${priceUSD},`);
        console.log(`      currency: '$',`);
        console.log(`      identifier: '${plan.identifier}',`);
        console.log(`      priceIdentifier: '${plan.price.identifier}',`);
        console.log(`      planType: 'country' as const,`);
        console.log(`      coveredCountries: ${JSON.stringify(plan.covered_countries)},`);
        console.log(`    },`);
      });
      console.log(`  ],\n`);
    }

  } catch (error) {
    console.error('Error fetching Saily plans:', error);
    throw error;
  }
}

fetchSailyPlans();

