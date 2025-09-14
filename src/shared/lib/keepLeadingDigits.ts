export const keepLeadingDigits = (str: string) => {
  const match = /\d+/.exec(str);

  return match ? match[0] : '';
};
