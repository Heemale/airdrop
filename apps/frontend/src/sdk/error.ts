import {
  extractErrorCodeAndModule,
  ERROR_CODE,
} from '@local/airdrop-sdk/utils';
interface Props {
  locale: string;
}

export const handleTxError = (message: string) => {
  const { module, errorCode } = extractErrorCodeAndModule(message);
  if (module && errorCode) {
    const errorMessage = ERROR_CODE[module][errorCode.toString()];
    console.log({ errorMessage });
    return errorMessage ? `${module}_${errorMessage}` : message;
  }
  return message;
};
