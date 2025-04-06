import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useEffect, useState } from 'react';
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
  const record = useRecordContext();

  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  const handleDateTimeChange = (newDateTime: Dayjs | null) => {
    setSelectedDateTime(newDateTime);
  };

  useEffect(() => {
    if (record?.[source]) {
      const initialDate = dayjs(Number(record[source]) * 1000);
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
