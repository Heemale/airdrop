import { ConnectButton as Connect } from '@mysten/dapp-kit';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const ConnectButton = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return <Connect connectText={t('Connect')} />;
};

export default ConnectButton;
