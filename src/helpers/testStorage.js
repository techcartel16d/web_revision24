// // src/helpers/testStorage.js
// // import { set, get, del } from 'idb-keyval';
// import { set, get, del, keys as idbKeys, del as idbDelete } from 'idb-keyval';
// import CryptoJS from 'crypto-js';

// const SECRET_KEY = 'test@secureKey2025'; // Make sure this is consistent and secure

// const encryptData = (data) => {
//     return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
// };

// const decryptData = (encryptedData) => {
//     const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
//     const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//     return JSON.parse(decrypted);
// };

// const generateKey = (testId, keyName) => `test_${testId}_${keyName}`;

// export const secureSaveTestData = async (testId, key, data) => {
//     try {
//         const encrypted = encryptData(data);
//         await set(generateKey(testId, key), encrypted);
//     } catch (error) {
//         console.error(`❌ Failed to save ${key}:`, error);
//     }
// };

// export const secureGetTestData = async (testId, key) => {
//     try {
//         const encrypted = await get(generateKey(testId, key));
//         if (!encrypted) return null;
//         return decryptData(encrypted);
//     } catch (error) {
//         console.error(`❌ Failed to load ${key}:`, error);
//         return null;
//     }
// };

// export const secureRemoveTestData = async (testId, key) => {
//     try {
//         await del(generateKey(testId, key));
//     } catch (error) {
//         console.error(`❌ Failed to remove ${key}:`, error);
//     }
// };

// // export const clearAllTestData = async (testId) => {
// //  const keys = [
// //     'spentTime',
// //     'optionSelected',
// //     'markedForReview',
// //     'skippedQuestions',
// //     'selectedOptions',
// //     'marked_with_ans',
// //     'pause_status_array' // 🔴 Add this line
// //   ];

// //   for (const key of keys) {
// //     await secureRemoveTestData(testId, key);
// //   }
// // };


// export const clearAllTestData = async (testId) => {
//     const keys = [
//         'spentTime',
//         'optionSelected',
//         'markedForReview',
//         'skippedQuestions',
//         'selectedOptions',
//         'marked_with_ans'
//     ];

//     for (const key of keys) {
//         await secureRemoveTestData(testId, key);
//     }

//     // 🧹 Remove paused entry from pause_status_array
//     const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//     const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//     await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
// };



// // 🧨 Delete everything from IndexedDB (All test data, all keys)
// export const clearAllEncryptedTestData = async () => {
//     try {
//         const allKeys = await idbKeys();

//         for (const key of allKeys) {
//             await idbDelete(key);
//             // console.log(`🗑️ Deleted encrypted key: ${key}`);
//         }

//         // console.log("✅ All encrypted test data cleared.");
//     } catch (error) {
//         console.error("❌ Failed to clear all encrypted data:", error);
//     }
// };


// // CHECK ALL ENTRIES
// export const checkAllEncryptedTestData = async () => {
//     try {
//         const allKeys = await idbKeys();

//         if (!allKeys.length) {
//             // console.log("📭 No encrypted test data found.");
//             return [];
//         }

//         const result = [];

//         for (const key of allKeys) {
//             try {
//                 const encrypted = await get(key);
//                 const decrypted = decryptData(encrypted);
//                 result.push({ key, data: decrypted });
//             } catch (error) {
//                 result.push({ key, data: "❌ Failed to decrypt (maybe corrupted or wrong key)" });
//             }
//         }

//         // console.log("🔐 All Encrypted Test Data:");
//         console.table(result); // Nice formatted output in dev console

//         return result;
//     } catch (error) {
//         console.error("❌ Failed to fetch encrypted test data:", error);
//         return [];
//     }
// };



import { set, get, del, keys as idbKeys, del as idbDelete } from 'idb-keyval';
import CryptoJS from 'crypto-js';
import { GLOBAL_SECRET_KEY } from './encryptionConfig';

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), GLOBAL_SECRET_KEY).toString();
};

const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, GLOBAL_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
};

const generateKey = (testId, keyName) => `test_${testId}_${keyName}`;

export const secureSaveTestData = async (testId, key, data) => {
    try {
        const encrypted = encryptData(data);
        await set(generateKey(testId, key), encrypted);
    } catch (error) {
        console.error(`❌ Failed to save ${key}:`, error);
    }
};

export const secureGetTestData = async (testId, key) => {
    try {
        const encrypted = await get(generateKey(testId, key));
        if (!encrypted) return null;
        return decryptData(encrypted);
    } catch (error) {
        console.error(`❌ Failed to load ${key}:`, error);
        return null;
    }
};

export const secureRemoveTestData = async (testId, key) => {
    try {
        await del(generateKey(testId, key));
    } catch (error) {
        console.error(`❌ Failed to remove ${key}:`, error);
    }
};

export const clearAllTestData = async (testId) => {
    const keys = [
        'spentTime',
        'optionSelected',
        'markedForReview',
        'skippedQuestions',
        'selectedOptions',
        'marked_with_ans'
    ];

    for (const key of keys) {
        await secureRemoveTestData(testId, key);
    }

    const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
    const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
    await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
};

export const clearAllEncryptedTestData = async () => {
    try {
        const allKeys = await idbKeys();

        for (const key of allKeys) {
            await idbDelete(key);
            // console.log(`🗑️ Deleted encrypted key: ${key}`);
        }

        // console.log("✅ All encrypted test data cleared.");
    } catch (error) {
        console.error("❌ Failed to clear all encrypted data:", error);
    }
};

export const checkAllEncryptedTestData = async () => {
    try {
        const allKeys = await idbKeys();

        if (!allKeys.length) {
            // console.log("📭 No encrypted test data found.");
            return [];
        }

        const result = [];

        for (const key of allKeys) {
            try {
                const encrypted = await get(key);
                const decrypted = decryptData(encrypted);
                result.push({ key, data: decrypted });
            } catch (error) {
                result.push({ key, data: "❌ Failed to decrypt (maybe corrupted or wrong key)" });
            }
        }

        // console.log("🔐 All Encrypted Test Data:");
        // console.table(result);
        return result;
    } catch (error) {
        console.error("❌ Failed to fetch encrypted test data:", error);
        return [];
    }
};
