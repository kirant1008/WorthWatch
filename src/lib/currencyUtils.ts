// src/lib/currencyUtils.ts

export const BASE_CURRENCY = 'USD';

// Rates define how many units of the keyed currency you get for 1 unit of BASE_CURRENCY
// Example: For 1 USD, you get 83.3 INR. So, MOCKED_EXCHANGE_RATES['INR'] = 83.3
export const MOCKED_EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 157.0,
  CAD: 1.37,
  AUD: 1.50,
  INR: 83.3,
};

/**
 * Converts a monetary value from a source currency to a target currency.
 * @param value The amount to convert.
 * @param sourceCurrency The currency code of the input 'value'.
 * @param targetCurrency The currency code to convert the 'value' to.
 * @param rates A record of exchange rates, where each rate is the amount of that currency equivalent to 1 unit of the baseDefinitionCurrency.
 * @param baseDefinitionCurrency The currency against which all rates in the 'rates' object are defined.
 * @returns The converted value in the targetCurrency. Returns original value if conversion is not possible.
 */
export function convertAmount(
  value: number,
  sourceCurrency: string,
  targetCurrency: string,
  rates: Record<string, number> = MOCKED_EXCHANGE_RATES,
  baseDefinitionCurrency: string = BASE_CURRENCY
): number {
  if (sourceCurrency === targetCurrency) {
    return value;
  }

  const rateSource = rates[sourceCurrency];
  const rateTarget = rates[targetCurrency];

  if (rateSource === undefined) {
    console.warn(`Exchange rate not available for source currency: ${sourceCurrency}. Returning original value.`);
    return value;
  }
  if (rateTarget === undefined) {
    console.warn(`Exchange rate not available for target currency: ${targetCurrency}. Returning original value.`);
    return value;
  }
  
  if (rateSource === 0) {
    console.warn(`Exchange rate for source currency ${sourceCurrency} is zero, division by zero avoided. Returning original value.`);
    return value;
  }

  // Step 1: Convert the value from sourceCurrency to baseDefinitionCurrency.
  const valueInBase = value / rateSource;

  // Step 2: Convert the value from baseDefinitionCurrency to targetCurrency.
  const valueInTarget = valueInBase * rateTarget;

  return valueInTarget;
}
