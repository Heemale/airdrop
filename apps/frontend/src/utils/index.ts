export const getCoinTypeName = (coinType: string): string => {
  const parts = coinType.split('::');
  return parts[parts.length - 1];
};
