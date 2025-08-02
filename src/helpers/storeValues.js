// secureStorage.js
import { set, get, del } from 'idb-keyval';
import CryptoJS from 'crypto-js';
import { GLOBAL_SECRET_KEY } from './encryptionConfig';

// Encrypt a value before storing
const encrypt = (value) => {
    const stringValue = JSON.stringify(value);
    return CryptoJS.AES.encrypt(stringValue, GLOBAL_SECRET_KEY).toString();
};

// Decrypt a value after retrieving
const decrypt = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, GLOBAL_SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (err) {
        console.error("Decryption failed", err);
        return null;
    }
};

// Save any key-value securely
export const secureSet = async (key, value) => {
    try {
        const encryptedValue = encrypt(value);
        await set(key, encryptedValue);
    } catch (err) {
        console.error("Error saving secure value:", err);
    }
};

// Get any value by key
export const secureGet = async (key) => {
    try {
        const encryptedValue = await get(key);
        if (!encryptedValue) return null;
        return decrypt(encryptedValue);
    } catch (err) {
        console.error("Error getting secure value:", err);
        return null;
    }
};

// Delete a key
export const secureRemove = async (key) => {
    try {
        await del(key);
    } catch (err) {
        console.error("Error deleting secure value:", err);
    }
};
