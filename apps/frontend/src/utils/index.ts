export const getCoinTypeName = (coinType: string): string => {
  const parts = coinType.split('::');
  return parts[parts.length - 1];
};

export const isHexString = (str: string): boolean => {
  return str.startsWith('0x');
};
