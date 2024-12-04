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

export const extractErrorCodeAndModule = (
  errorMessage: string,
): {
  module: string | null;
  errorCode: number | null;
} => {
  const moduleMatch = errorMessage.match(/Identifier\("([^"]+)"\)/);
  const module = moduleMatch ? moduleMatch[1] : null;

  const moveAbortMatch = errorMessage.match(/MoveAbort\((.*?)\) in command/);
  const errorCode = moveAbortMatch
    ? (moveAbortMatch[1].match(/, (\d+)$/)?.[1] ?? null)
    : null;

  return {
    module,
    errorCode: errorCode ? parseInt(errorCode, 10) : null,
  };
};

export * from './constants';
export * from './error';
