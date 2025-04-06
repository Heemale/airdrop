import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useEffect, useState } from 'react';
import { dateToTimestamp } from '@/utils/time';
import { useController } from 'react-hook-form';
import { useRecordContext } from 'react-admin';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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

  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  const handleDateTimeChange = (newDateTime: Dayjs | null) => {
    setSelectedDateTime(newDateTime);
  };

  useEffect(() => {
    if (selectedDateTime) {
      field.onChange(dateToTimestamp(selectedDateTime.toDate()));
    } else {
      field.onChange(null);
    }
  }, [selectedDateTime]);

  // 初始化值
  useEffect(() => {
    if (record?.[source]) {
      const initialDate = dayjs(record[source]);
      setSelectedDateTime(initialDate);
    }
  }, [record, source]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={selectedDateTime}
        onChange={handleDateTimeChange}
        views={['year', 'day', 'hours', 'minutes', 'seconds']}
      />
    </LocalizationProvider>
  );
};

export default MyDateTimePicker;
