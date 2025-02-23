export const key = 'auth';

export const getAuth = () => {
  return localStorage.getItem(key);
};

export const setAuth = (auth: string) => {
  localStorage.setItem(key, auth);
};

export const removeAuth = () => {
  localStorage.removeItem(key);
};
