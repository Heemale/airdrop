import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Variants = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }} />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={200} height={60} />
      <Skeleton variant="rounded" width={200} height={60} />
    </Stack>
  );
};

export default Variants;
