import { formatAddress } from '@mysten/sui/utils';
import FormatTextField from './FormatTextField';

const AddressTextField = ({
  source,
  label,
}: {
  source: string;
  label: string;
}) => {
  return (
    <FormatTextField source={source} label={label} render={formatAddress} />
  );
};

export default AddressTextField;
