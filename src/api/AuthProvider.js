import api from "./axiosConfig";


const UserApiProvider = {
  register: async (userData) => {
    const res = await api.post("/user_register", userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post("/user_login", credentials);
    console.log('User Login', res);
    return res.data;

  },

  getWallet: async () => {
    const res = await api.get("/get-wallet");
    return res.data;
  },

  sendOtp: async (otpData) => {
    const res = await api.post("/verify_register_otp", otpData);
    return res.data;
  },

  resendOtp: async (phoneNumber) => {
    const res = await api.post("/auth/resend-otp", { phoneNumber });
    return res.data;
  },

  forgot_for_otp_Password: async (mobile) => {
    const res = await api.post("/otp-forget-password", { mobile });
    return res.data;
  },

  verify_otp_for_forgot_password: async (verifyOtpData) => {
    const res = await api.post("/verify_register_otp", verifyOtpData);
    return res.data;
  },

  update_for_forgot_password: async (forgotPassData) => {
    const res = await api.post("/password-set", forgotPassData);
    return res.data;
  },

  setPin: async (pinData) => {
    const res = await api.post("/set-password", pinData);
    return res.data;
  },

  updatePassword: async (passwordData) => {
    const res = await api.post("/auth/update-password", passwordData);
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await api.post("/profile-update", profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  userProfileGet: async () => {
    const res = await api.post("/profile-get", "", {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/logout");
    return res.data;
  },

  getReportQuetion: async () => {
    const res = await api.get("/user-reported-question-get");
    return res.data;
  },

  reportQuestionSubmit: async (quetionReportData) => {
    const res = await api.post("/question-report", quetionReportData);
    return res.data;
  },

  getUserCollectionDetails: async () => {
    const res = await api.get("/user-collection-detail-get");
    return res.data;
  },

  addUserCollection: async (collection) => {
    const res = await api.post("/user-collection", { collection });
    return res.data;
  },

  removeUserCollection: async (collection) => {
    const res = await api.post("/user-collection-remove", { collection });
    return res.data;
  },

  reportQuestion: async (reportedQuetion) => {
    const res = await api.post("/question-report", reportedQuetion);
    return res.data;
  },

  reportQuestionGet: async () => {
    const res = await api.get("/user-reported-question-get");
    return res.data;
  },

  getNotification: async () => {
    const res = await api.get("/notification-get");
    return res.data;
  },
};

export default UserApiProvider;
