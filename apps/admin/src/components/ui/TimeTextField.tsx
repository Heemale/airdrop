import { useRecordContext } from 'react-admin';
import { formatTimestamp } from '@/utils/time';
import * as React from 'react';

const TimeTextField = ({
  source,
  label,
}: {
  source: string;
  label?: string;
}) => {
  const record = useRecordContext();
  const text =
    !record || !record[source] || Number(record[source]) === 0
      ? '-'
      : formatTimestamp(Number(record[source]) * 1000);
  return <span>{text}</span>;
};

export default TimeTextField;
