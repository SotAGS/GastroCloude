export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();

export const generatePurchaseNumber = (): string => {
  const now = new Date();
  const seed = `${now.getTime()}`.slice(-6);
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  return `OC-${y}${m}${d}-${seed}`;
};