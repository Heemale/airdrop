import { useRecordContext } from 'react-admin';
import Copy from './Copy';

const FormatTextField = ({
  source,
  label,
  render,
}: {
  source: string;
  label: string;
  render: (value: string) => string;
}) => {
  const record = useRecordContext();

  if (!record || !record[source]) return '-';

  const fullContent = record[source];

  return <Copy text={fullContent} render={render} />;
};

export default FormatTextField;
