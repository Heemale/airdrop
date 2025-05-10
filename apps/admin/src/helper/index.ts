import { parseStructTag, formatAddress } from '@mysten/sui/utils';

export const formatType = (objectType: string): string | null => {
  try {
    const { address, module, name } = parseStructTag(objectType);
    return formatAddress(address) + '::' + module + '::' + name;
  } catch (e) {
    return null;
  }
};
