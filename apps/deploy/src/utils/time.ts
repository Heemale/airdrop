export const sleep = (second: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });
};
