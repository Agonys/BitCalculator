export const numberToRoman = (input?: string | number): string | null => {
  const num = Number(input);

  if (input === undefined || input === null || isNaN(num) || String(input).trim() === '' || num < 1) {
    return null;
  }

  const map: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  let remainder = num;
  let result = '';

  for (const [value, numeral] of map) {
    const count = Math.floor(remainder / value);
    if (count > 0) {
      result += numeral.repeat(count);
      remainder -= value * count;
    }
  }

  return result;
};
