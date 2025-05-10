import { formatDigest } from '@mysten/sui/utils';
import FormatTextField from './FormatTextField';

const DigestTextField = ({
  source,
  label,
}: {
  source: string;
  label: string;
}) => {
  return (
    <FormatTextField source={source} label={label} render={formatDigest} />
  );
};

export default DigestTextField;
