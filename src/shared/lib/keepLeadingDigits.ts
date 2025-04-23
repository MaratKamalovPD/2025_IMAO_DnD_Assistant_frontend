export const keepLeadingDigits = (str: string) => {
  const match = str.match(/^\d+/);

  return match ? match[0] : '';
};
