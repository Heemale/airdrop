export const handleBigInt = (result: any) => {
  return JSON.stringify(result, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};
