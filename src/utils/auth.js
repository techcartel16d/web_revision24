// utils/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // या जो token/session आप use कर रहे हों
};
