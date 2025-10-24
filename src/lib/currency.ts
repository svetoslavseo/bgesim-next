// Currency types and constants
export type Currency = 'BGN' | 'EUR';

export const CURRENCY_SYMBOLS = {
  BGN: 'лв',
  EUR: '€',
};

// Fixed exchange rate (EUR to BGN is fixed)
export const FIXED_RATES = {
  EUR_TO_BGN: 1.96,
};

// Interface for exchange rates data
export interface ExchangeRates {
  rates: {
    USD_TO_BGN: number;
    USD_TO_EUR: number;
  };
  lastUpdated: string;
}

// Load exchange rates from the JSON file
let cachedRates: ExchangeRates | null = null;

export async function loadExchangeRates(): Promise<ExchangeRates> {
  if (cachedRates) {
    return cachedRates;
  }

  try {
    const response = await fetch('/currency-rates.json');
    if (!response.ok) {
      throw new Error('Failed to load exchange rates');
    }
    cachedRates = await response.json();
    return cachedRates!;
  } catch (error) {
    console.error('Error loading exchange rates:', error);
    // Return default rates if loading fails
    return {
      rates: {
        USD_TO_BGN: 1.80,
        USD_TO_EUR: 0.92,
      },
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Convert USD price to target currency
export function convertPrice(
  usdPrice: number,
  targetCurrency: Currency,
  rates?: ExchangeRates['rates']
): number {
  // Use provided rates or default values
  const usdToBgn = rates?.USD_TO_BGN || 1.80;
  const usdToEur = rates?.USD_TO_EUR || 0.92;

  switch (targetCurrency) {
    case 'BGN':
      return usdPrice * usdToBgn;
    case 'EUR':
      return usdPrice * usdToEur;
    default:
      return usdPrice;
  }
}

// Format price with currency symbol
export function formatPrice(price: number, currency: Currency): string {
  return `${price.toFixed(2)}${CURRENCY_SYMBOLS[currency]}`;
}

// Convert BGN to EUR or vice versa
export function convertBetweenBgnAndEur(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === 'BGN' && toCurrency === 'EUR') {
    return amount / FIXED_RATES.EUR_TO_BGN;
  }

  if (fromCurrency === 'EUR' && toCurrency === 'BGN') {
    return amount * FIXED_RATES.EUR_TO_BGN;
  }

  return amount;
}




