/**
 * Converts a number to uppercase Philippine Peso words string.
 * e.g., 2500 -> "TWO THOUSAND FIVE HUNDRED PESOS ONLY"
 */
export function numberToWords(num: number): string {
  if (!num || isNaN(num) || num === 0) return 'ZERO PESOS ONLY';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(n: number): string {
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : '') + ' ';
    return a[Math.floor(n / 100)] + ' Hundred ' + convertChunk(n % 100);
  }

  const integerPart = Math.floor(num);
  const cents = Math.round((num - integerPart) * 100);

  const billions = Math.floor(integerPart / 1000000000);
  const millions = Math.floor((integerPart % 1000000000) / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const remainder = integerPart % 1000;

  let str = '';
  if (billions) str += convertChunk(billions) + 'Billion ';
  if (millions) str += convertChunk(millions) + 'Million ';
  if (thousands) str += convertChunk(thousands) + 'Thousand ';
  if (remainder) str += convertChunk(remainder);

  str = str.trim() + ' Pesos';
  if (cents > 0) {
    str += ' and ' + cents + '/100';
  } else {
    str += ' Only';
  }
  return str.toUpperCase();
}

export function formatCurrency(amount: number): string {
  return '₱' + (amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
