// session.js
const USER_ID_KEY = 'userId';
const ROLE_KEY = 'role';

export const setUserSession = (userId, role) => {
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(ROLE_KEY, role);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

export const getUserRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const clearUserSession = () => {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLE_KEY);
};
