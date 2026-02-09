/**
 * Converts a currency amount string to cents (integer)
 * Handles both comma and period as decimal separators
 * Examples: "10295.10" -> 1029510, "10295,10" -> 1029510
 */
export function toCents(amount: string | number): number {
  const str = String(amount).trim();
  // Replace comma with period for parsing
  const normalized = str.replace(',', '.');
  const value = parseFloat(normalized);
  if (isNaN(value)) return 0;
  return Math.round(value * 100);
}

/**
 * Converts cents (integer) to currency amount
 * Example: 1029510 -> 10295.10
 */
export function fromCents(cents: number): number {
  return cents / 100;
}
