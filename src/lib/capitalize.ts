export const capitalize = (str?: string) => {
  if (!str?.trim()) return null;

  const cleanString = str.trim();

  return cleanString.charAt(0).toUpperCase() + cleanString.slice(1).toLowerCase();
};
