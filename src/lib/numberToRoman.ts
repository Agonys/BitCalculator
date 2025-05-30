export const numberToRoman = (num: number): string => {
  if (num < 1 || num > 3999) return num.toString();
  const roman: [number, string][] = [
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
  let result = '';
  for (const [value, numeral] of roman) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};
