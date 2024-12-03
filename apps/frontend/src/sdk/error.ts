import {
  extractErrorCodeAndModule,
  ERROR_CODE,
} from '@local/airdrop-sdk/utils';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';
interface Props {
  locale: string;
}

export const handleTxError =  async (e: Error,props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);
  const { module, errorCode } = extractErrorCodeAndModule(e.message);
  if (module && errorCode) {
    const errorMessage = ERROR_CODE[module][errorCode.toString()];
    return errorMessage ? t(`${module}_${errorMessage}`) : e.message;
  }
  return e.message;
};
