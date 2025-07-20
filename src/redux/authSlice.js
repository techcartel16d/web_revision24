import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import UserApiProvider from '../api/AuthProvider';


// Initial state
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
  userInfo: {},
};


// This thunk fetches the details of a specific test series based on the test ID
export const register = createAsyncThunk(
  'user/register',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// This thunk handles user login
export const login = createAsyncThunk(
  'user/login',
  async (credentials, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// This thunk handles user wallet fetch
export const getWalletSlice = createAsyncThunk(
  'user/getWalletSlice',
  async (_, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.getWallet();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user credentials as input and returns the response
export const loadUserData = createAsyncThunk(
  'user/loadUserData',
  async (_, {rejectWithValue}) => {
    try {
      const token = storage.getString('token');
      const userData = storage.getString('user');
      if (userData && token) {
        return {
          user: JSON.parse(userData),
          token: token,
        };
      }
      return {};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// This thunk handles user profile update
export const updateProfileSlice = createAsyncThunk(
  'user/updateProfileSlice',
  async (profileData, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (otpData, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.sendOtp(otpData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const forgotPasswordSlice = createAsyncThunk(
  'user/forgotPasswordSlice',
  async (mobile, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.forgot_for_otp_Password(mobile);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const verifyOtpSlice = createAsyncThunk(
  'user/verifyOtpSlice',
  async (verifyOtpData, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.verify_otp_for_forgot_password(
        verifyOtpData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const updateForgotPasswordSlice = createAsyncThunk(
  'user/updateForgotPasswordSlice',
  async (verifyOtpData, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.update_for_forgot_password(
        verifyOtpData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const getUserInfoSlice = createAsyncThunk(
  'user/getUserInfoSlice',
  async (_, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.userProfileGet();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const attendQuestionSubmitSlice = createAsyncThunk(
  'home/attendQuestionSubmit',
  async (attendQuestion, {rejectWithValue}) => {
    try {
      const data = await UserApiProvider.submitAttendQuestions(attendQuestion);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// It takes user profile data as input and returns the response
export const setPin = createAsyncThunk(
  'user/setPin',
  async (pinData, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.setPin(pinData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const logoutSlice = createAsyncThunk(
  'user/logoutSlice',
  async (_, {rejectWithValue}) => {
    try {
      const response = await UserApiProvider.logout();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// REPORT QUETION GET
export const getReportedQuetionSlice = createAsyncThunk(
  'user/getReportedQuetionSlice',
  async (_, {rejectWithValue}) => {
    try {
      const res = await UserApiProvider.getReportQuetion();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// GET USER COLLECTION DETAILS
export const getUserCollectionDetailSlice = createAsyncThunk(
  'user/getUserCollectionDetailSlice',
  async (_, {rejectWithValue}) => {
    try {
      const res = await UserApiProvider.getUserCollectionDetails();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

//ADD USER COLLECTION
export const addUserCollectionSlice = createAsyncThunk(
  'user/addUserCollectionSlice',
  async (collection, {rejectWithValue}) => {
    console.log('collectionData', collection);
    try {
      const res = await UserApiProvider.addUserCollection(collection);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

//REMOVE USER COLLECTION
export const removeUserCollectionSlice = createAsyncThunk(
  'user/removeUserCollectionSlice',
  async (collection, {rejectWithValue}) => {
    console.log('collectionData in userSlice ======>', collection);
    try {
      const res = await UserApiProvider.removeUserCollection(collection);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
//REPORTED QUESTION
export const reportedQuestionSlice = createAsyncThunk(
  'user/reportedQuestionSlice',
  async (reportedQuetion, {rejectWithValue}) => {
    console.log('collectionData', reportedQuetion);
    try {
      const res = await UserApiProvider.reportQuestion(reportedQuetion);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
//REPORTED QUESTION GET
export const reportedQuestionGetSlice = createAsyncThunk(
  'user/reportedQuestionGetSlice',
  async (reportedQuetion, {rejectWithValue}) => {
    console.log('collectionData', reportedQuetion);
    try {
      const res = await UserApiProvider.reportQuestionGet();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
//NOTIFICATION GET
export const geNotificationSlice = createAsyncThunk(
  'user/geNotificationSlice',
  async (_, {rejectWithValue}) => {
    try {
      const res = await UserApiProvider.getNotification();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Slice
const authUser = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    // ✅ SET USER INFO: Save to Redux and MMKV
    setUserInfo: (state, action) => {
      const userData = action.payload;

      state.userInfo = userData;

      try {
        storage.set('userInfo', JSON.stringify(userData));
        console.log('✅ userInfo saved to MMKV:', userData);
      } catch (error) {
        console.log('❌ Error saving userInfo to MMKV:', error);
      }
    },

    // ✅ GET USER INFO: Load from MMKV and set in Redux
    getUserInfo: state => {
      try {
        const userDataString = storage.getString('userInfo');

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          state.userInfo = userData;
          console.log('✅ userInfo loaded from MMKV:', userData);
        } else {
          state.userInfo = null;
          console.warn('⚠️ No userInfo found in MMKV');
        }
      } catch (error) {
        console.log('❌ Error reading userInfo from MMKV:', error);
      }
    },

    // ✅ CLEAR USER INFO: Remove from Redux and MMKV
    clearUserInfo: state => {
      state.userInfo = null;

      try {
        storage.delete('userInfo');
        console.log('🗑️ userInfo deleted from MMKV');
      } catch (error) {
        console.log('❌ Error deleting userInfo from MMKV:', error);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadUserData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      

      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        if (action.payload.token) {
          try {
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.data));
          } catch (error) {
            console.log('storage mmkv error', error);
          }
        }

        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message;
      })

      .addCase(logoutSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutSlice.fulfilled, (state, action) => {
        state.loading = false;

        // Clear MMKV
        storage.delete('token');
        storage.delete('user');

        // Clear Redux state
        state.token = null;
        state.user = null;
        state.userInfo = {}; // ✅ Clear userInfo

        state.message = action.payload.message;
      })
      .addCase(logoutSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message;
      })

      .addCase(updateProfileSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        if (action.payload.data) {
          // Use the central reducer to set userInfo and MMKV
          userSlice.caseReducers.setUserInfo(state, {
            payload: action.payload.data,
          });
        }
      })
      .addCase(updateProfileSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserInfoSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfoSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.userInfo = action.payload.data;

        if (action.payload.data) {
          // Use the central reducer to set userInfo and MMKV
          userSlice.caseReducers.setUserInfo(state, {
            payload: action.payload.data,
          });
        }
      })
      .addCase(getUserInfoSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setUserInfo, getUserInfo, clearUserInfo} = authUser.actions;

export default authUser.reducer;
