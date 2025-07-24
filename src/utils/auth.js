// utils/auth.js
import { get } from 'idb-keyval';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'user_data_encrypted';
const SECRET_KEY = 'mySuperSecretKey@123'; // Use same key used in saveUserDataEncrypted()

// ✅ Get decrypted user token
export const getUserToken = async () => {
  try {
    const encrypted = await get(STORAGE_KEY);
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const userData = JSON.parse(decrypted);
    // // console.log("userData", userData)

    return userData.token || null;
  } catch (err) {
    console.error("❌ Error getting token:", err);
    return null;
  }
};

// ✅ Check if user is authenticated
export const isAuthenticated = async () => {
  const token = await getUserToken();
  return !!token;
};
