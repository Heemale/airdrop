import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useEffect, useState } from 'react';
import { dateToTimestamp } from '@/utils/time';
import { useController } from 'react-hook-form';
import { useRecordContext } from 'react-admin';

const MyDateTimePicker = ({
  source,
  label,
}: {
  source: string;
  label?: string;
}) => {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({ name: source, defaultValue: null });
  const record = useRecordContext();

  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const handleDateTimeChange = (newDateTime: Date | null) => {
    setSelectedDateTime(newDateTime);
  };

  useEffect(() => {
    if (selectedDateTime !== null) {
      // @ts-ignore
      field.onChange(dateToTimestamp(selectedDateTime?.$d)); // data send back to hook form
    } else {
      field.onChange(null);
    }
  }, [selectedDateTime]);

  // TODO 设置初始值
  // useEffect(() => {
  //   if (!record) return;
  //   setSelectedDateTime(new Date(record[source]));
  // }, [record]);

  return (
    <DateTimePicker
      label={label}
      value={selectedDateTime}
      onChange={handleDateTimeChange}
      views={['year', 'day', 'hours', 'minutes', 'seconds']}
    />
  );
};

export default MyDateTimePicker;
