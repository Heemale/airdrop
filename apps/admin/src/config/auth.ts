export const getAuth = () => {
  return localStorage.getItem('auth');
};

export const setAuth = (auth: string) => {
  localStorage.getItem(auth);
};

export const removeAuth = () => {
  localStorage.removeItem('auth');
};
