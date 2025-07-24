import axios from "axios";

const API_BASE_URL = "https://revision24.com/api";

const UserApiProvider = {




    register: async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user_register`, userData)
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user_login`, credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getWallet: async () => {
        try {
            const token = storage.getString('token');
            const response = await axios.get(`${API_BASE_URL}/get-wallet`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    sendOtp: async (otpData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/verify_register_otp`, otpData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    resendOtp: async (phoneNumber) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { phoneNumber });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    forgot_for_otp_Password: async (mobile) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/otp-forget-password`, { mobile });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    verify_otp_for_forgot_password: async (verifyOtpData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/otp-forget-password`, verifyOtpData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    update_for_forgot_password: async (forgotPassData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/otp-forget-password`, forgotPassData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    setPin: async (pinData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/set-password`, pinData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updatePassword: async (passwordData) => {
        try {
            const token = storage.getString('token');
            const response = await axios.post(`${API_BASE_URL}/auth/update-password`, passwordData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/profile-update`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },


    userProfileGet: async () => {
        try {
            const token = storage.getString('token');
            console.log("token", token)
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/profile-get`, "", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return res.data;
        } catch (error) {
            console.log("ERROR IN LOGOUT ", error)
        }
    },


    // // REPORT QUETION GET API
    getReportQuetion: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-reported-question-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN REPORT QUETION GET API ", error)
        }
    },
    // REPORT QUETION  SUBMIT API
    reportQuestionSubmit: async (quetionReportData) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/question-report`, quetionReportData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN  REPORT QUETION  SUBMIT API ", error)
        }
    },

    // GET USER COLLECTION DETAILS API
    getUserCollectionDetails: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-collection-detail-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION DETAILS API ", error)
        }
    },
    // USER COLLECTION ADD API
    addUserCollection: async (collection) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/user-collection`, { collection }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("response in add collection", res)
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    removeUserCollection: async (collection) => {
        console.log("collection in user Provider========>", { collection })
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/user-collection-remove`, { collection }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("response in add collection", res)
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    // // REPORTED QUESTION ADD API
    reportQuestion: async (reportedQuetion) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/question-report`, reportedQuetion, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    reportQuestionGet: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-reported-question-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    getNotification: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/notification-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN NOTIFICATION GET ", error)
        }
    },
    updateProfile: async (profileData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/profile-update`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },










};

export default UserApiProvider;