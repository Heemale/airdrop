import { AuthProvider } from 'react-admin';
import { BASE_URL } from '@/config';
import { getAuth, removeAuth, setAuth } from '@/config/auth';
// import * as jwtDecode from 'jwt-decode';

export const authProvider: AuthProvider = {
  // called when the user attempts to log in
  login: ({ username, password }) => {
    const request = new Request(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((auth) => {
        setAuth(auth['accessToken']);
        return { redirectTo: '/' };
      })
      .catch(() => {
        throw new Error('登录失败');
      });
  },
  // called when the user clicks on the logout button
  logout: () => {
    removeAuth();
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      removeAuth();
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return check();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  // getPermissions: () => {
  //   const token = localStorage.getItem('auth');
  //
  //   if (!token) return Promise.reject();
  //
  //   const role = jwtDecode(token);
  //
  //   return role ? Promise.resolve(role) : Promise.reject();
  // },
};

export const check = () => {
  const token = getAuth();
  if (!token) return Promise.reject();

  const request = new Request(`${BASE_URL}/api/auth/profile`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
  });

  return fetch(request)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }
      return response.json(); // Parse the response JSON
    })
    .then((user) => {
      // Return the user data to indicate successful authentication
      return Promise.resolve(user);
    })
    .catch(() => {
      removeAuth();
      throw new Error('Authentication error');
    });
};
