export const getType = (input: string): string | null => {
  const regex = /<([^<>]*)>/;
  const match = input.match(regex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
};

export const toHexString = (byteArray: Array<number>) => {
  return Array.from(byteArray, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
};
