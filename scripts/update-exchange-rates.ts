import * as fs from 'fs';
import * as path from 'path';

const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'currency-rates.json');

interface ExchangeRateApiResponse {
  base: string;
  date: string;
  time_last_updated: number;
  rates: {
    [key: string]: number;
  };
}

async function updateExchangeRates() {
  try {
    console.log('Fetching exchange rates from API...');
    
    const response = await fetch(EXCHANGE_RATE_API_URL);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ExchangeRateApiResponse = await response.json();

    // Extract BGN and EUR rates
    const bgnRate = data.rates.BGN;
    const eurRate = data.rates.EUR;

    if (!bgnRate || !eurRate) {
      throw new Error('BGN or EUR rate not found in API response');
    }

    // Create the output data
    const outputData = {
      rates: {
        USD_TO_BGN: Number(bgnRate.toFixed(4)),
        USD_TO_EUR: Number(eurRate.toFixed(4)),
      },
      lastUpdated: new Date().toISOString(),
      source: 'ExchangeRate-API',
      apiDate: data.date,
    };

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf-8');

    console.log('✅ Exchange rates updated successfully!');
    console.log(`   USD to BGN: ${outputData.rates.USD_TO_BGN}`);
    console.log(`   USD to EUR: ${outputData.rates.USD_TO_EUR}`);
    console.log(`   Last updated: ${outputData.lastUpdated}`);
    console.log(`   File: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error updating exchange rates:', error);
    process.exit(1);
  }
}

// Run the update
updateExchangeRates();



