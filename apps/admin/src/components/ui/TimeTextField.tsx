import { useRecordContext } from 'react-admin';
import { formatTimestamp } from '@/utils/time';
import * as React from 'react';
import { convertLargeToSmall } from '@/utils/math';

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
      : formatTimestamp(Number(convertLargeToSmall(record[source], 3)));
  return <span>{text}</span>;
};

export default TimeTextField;
