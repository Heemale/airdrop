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

export const extractSubStatus = (errorMessage: string): bigint | null => {
  // Define a regex pattern to capture the number in `sub_status: Some(...)`
  const regex = /sub_status: Some\((\d+)\)/;

  // Use the regex to find the match
  const match = errorMessage.match(regex);

  if (match && match[1]) {
    // Return the extracted number as an integer
    return BigInt(match[1]);
  }

  // Return null if no match is found
  return null;
};

export * from './constants';
