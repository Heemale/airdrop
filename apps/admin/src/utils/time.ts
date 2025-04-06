export const sleep = (second: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });
};

export const formatTimestamp = (timestampMs: number): string => {
  const date = new Date(timestampMs);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getCurrentTimestampMs = (): number => {
  return Math.floor(Date.now());
};

export const dateToTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

export const timestampToDate = (timestamp: number): string => {
  const dateTime = new Date(timestamp * 1000);
  return dateTime.toISOString();
};
