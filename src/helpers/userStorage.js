// // src/helpers/userStorage.js
// import { set, get, del } from 'idb-keyval';
// import CryptoJS from 'crypto-js';

// const STORAGE_KEY = 'user_data_encrypted';
// const SECRET_KEY = 'mySuperSecretKey@123'; // इसे strong और consistent रखो
// const TEST_LOGIN_KEY = 'test_login_data_encrypted'; // for test login details save in 

// /**
//  * Save user info encrypted in IndexedDB
//  * @param {Object} data
//  */
// export const saveUserDataEncrypted = async (data) => {
//   try {
//     const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
//     await set(STORAGE_KEY, encrypted);
//     // console.log('✅ User data saved securely.');
//   } catch (error) {
//     console.error('❌ Failed to save user data:', error);
//   }
// };

// /**
//  * Get and decrypt user data from IndexedDB
//  * @returns {Object|null}
//  */
// export const getUserDataDecrypted = async () => {
//   try {
//     const encrypted = await get(STORAGE_KEY);
//     if (!encrypted) return null;

//     const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
//     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//     return JSON.parse(decryptedData);
//   } catch (error) {
//     console.error('❌ Failed to decrypt user data:', error);
//     return null;
//   }
// };

// /**
//  * Clear saved user data (optional)
//  */
// export const clearUserData = async () => {
//   try {
//     await del(STORAGE_KEY);
//     // console.log('🧹 User data cleared.');
//   } catch (error) {
//     console.error('❌ Failed to clear user data:', error);
//   }
// };


// // --- ✅ New Functions for Test Login Info ---
// export const saveTestLoginInfo = async (testLoginData) => {
//   try {
//     const encrypted = CryptoJS.AES.encrypt(JSON.stringify(testLoginData), SECRET_KEY).toString();
//     await set(TEST_LOGIN_KEY, encrypted);
//     // console.log('✅ Test login data saved securely.');
//   } catch (error) {
//     console.error('❌ Failed to save test login data:', error);
//   }
// };

// export const getTestLoginInfo = async () => {
//   try {
//     const encrypted = await get(TEST_LOGIN_KEY);
//     if (!encrypted) return null;
//     const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
//     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//     return JSON.parse(decryptedData);
//   } catch (error) {
//     console.error('❌ Failed to decrypt test login data:', error);
//     return null;
//   }
// };

// export const clearTestLoginInfo = async () => {
//   try {
//     await del(TEST_LOGIN_KEY);
//     // console.log('🧹 Test login data cleared.');
//   } catch (error) {
//     console.error('❌ Failed to clear test login data:', error);
//   }
// };




import { set, get, del } from 'idb-keyval';
import CryptoJS from 'crypto-js';
import { GLOBAL_SECRET_KEY } from './encryptionConfig';

const STORAGE_KEY = 'user_data_encrypted';
const TEST_LOGIN_KEY = 'test_login_data_encrypted'; // For test login details

/**
 * Save user info encrypted in IndexedDB
 * @param {Object} data
 */
export const saveUserDataEncrypted = async (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), GLOBAL_SECRET_KEY).toString();
    await set(STORAGE_KEY, encrypted);
    // console.log('✅ User data saved securely.');
  } catch (error) {
    console.error('❌ Failed to save user data:', error);
  }
};

/**
 * Get and decrypt user data from IndexedDB
 * @returns {Object|null}
 */
export const getUserDataDecrypted = async () => {
  try {
    const encrypted = await get(STORAGE_KEY);
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, GLOBAL_SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('❌ Failed to decrypt user data:', error);
    return null;
  }
};

/**
 * Clear saved user data (optional)
 */
export const clearUserData = async () => {
  try {
    await del(STORAGE_KEY);
    // console.log('🧹 User data cleared.');
  } catch (error) {
    console.error('❌ Failed to clear user data:', error);
  }
};

// --- ✅ Test Login Info Functions ---
export const saveTestLoginInfo = async (testLoginData) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(testLoginData), GLOBAL_SECRET_KEY).toString();
    await set(TEST_LOGIN_KEY, encrypted);
    // console.log('✅ Test login data saved securely.');
  } catch (error) {
    console.error('❌ Failed to save test login data:', error);
  }
};

export const getTestLoginInfo = async () => {
  try {
    const encrypted = await get(TEST_LOGIN_KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, GLOBAL_SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('❌ Failed to decrypt test login data:', error);
    return null;
  }
};

export const clearTestLoginInfo = async () => {
  try {
    await del(TEST_LOGIN_KEY);
    // console.log('🧹 Test login data cleared.');
  } catch (error) {
    console.error('❌ Failed to clear test login data:', error);
  }
};
