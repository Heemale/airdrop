import { useRecordContext, useReference } from 'react-admin';
import { convertSmallToLarge } from '@/utils/math';

const UnitConvertField = ({
  source,
  label,
}: {
  source: string;
  label: string;
}) => {
  const record = useRecordContext();
  const coinType = record?.coinType;

  const { referenceRecord, isLoading, error } = useReference({
    reference: 'token-metadatas',
    id: coinType,
  });

  if (!record || !record[source]) return '-';
  if (isLoading) return 'Loading...';
  if (error) return 'Error';

  const decimals = referenceRecord?.decimals || 0;
  return convertSmallToLarge(record[source].toString(), decimals);
};

export default UnitConvertField;
