// frontend/src/utils/auth.js
export const saveToken = (token) => {
  try { localStorage.setItem('token', token); } catch (e) { console.warn(e); }
};
export const getToken = () => {
  try { return localStorage.getItem('token'); } catch (e) { return null; }
};
export const removeToken = () => {
  try { localStorage.removeItem('token'); } catch (e) { console.warn(e); }
};
export const isAuthenticated = () => !!getToken();