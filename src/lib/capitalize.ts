export const capitalize = (str?: string) => {
  const cleanString = str?.trim();

  if (!cleanString) return null;
  return cleanString.charAt(0).toUpperCase() + cleanString.slice(1).toLowerCase();
};
