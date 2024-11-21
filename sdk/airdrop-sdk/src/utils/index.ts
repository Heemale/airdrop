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

export const extractErrorCodeAndModule = (error: string) => {
  const moduleRegex = /name:\s*Identifier\("([^"]+)"\)/;
  const errorCodeRegex = /sub_status:\s*Some\((\d+)\)/;

  const moduleMatch = error.match(moduleRegex);
  const errorCodeMatch = error.match(errorCodeRegex);

  const module = moduleMatch ? moduleMatch[1] : null;
  const errorCode = errorCodeMatch ? Number(errorCodeMatch[1]) : null;

  return {
    module,
    errorCode,
  };
};

export * from './constants';
export * from './error';
