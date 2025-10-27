// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import DoubtSolution from '../api/DoubtSolution';

// // ✅ Async Thunks for API calls
// export const doubtSolutionData = createAsyncThunk(
//   'doubtSolution/submitDoubt',
//   async (formData, { rejectWithValue }) => {

//     try {
//       const response = await DoubtSolution.postDoubtData(formData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

// // // Like Doubt Slice Data
// // export const likeDoubtData= createAsyncThunk(
// //   'likeDoubtdata/submitLike',
// //   async (doubtId,{rejectWithValue}) => {
// //     try{
// //       const response =await DoubtSolution.postLikeDoubt(doubtId);
// //       return response;
// //     }catch(error){
// //       return rejectWithValue(error);
// //     }
// //   }
// // )


// // ✅ FIXED: Like Doubt Thunk
// export const likeDoubtData = createAsyncThunk(
//   'doubtSolution/likeDoubt',
//   async (solveId, { rejectWithValue }) => {
//     try {
//       console.log('📤 Redux: Calling Like API for solve_id:', solveId);
//       const response = await DoubtSolution.postLikeDoubt(solveId);
//       console.log('📥 Redux: Like API Success:', response);

//       return {
//         solveId,
//         likes: response.likes,
//         message: response.message
//       };
//     } catch (error) {
//       console.error('📛 Redux: Like API Failed:', error);
//       return rejectWithValue(error);
//     }
//   }
// );
// // My Doubt Solution
// export const myDoubtSolutionData = createAsyncThunk(
//   'doubtSolution/getMyDoubts',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await DoubtSolution.getMyDoubtData();
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

// export const allDoubtSolutionData = createAsyncThunk(
//   'doubtSolution/getAllDoubts',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await DoubtSolution.getAllDoubtData();
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

// // ✅ Initial State
// const initialState = {
//   // Data
//   allDoubts: [],
//   myDoubts: [],

//   // Loading states
//   loading: false,
//   submitLoading: false,
//   myDoubtsLoading: false,
//   allDoubtsLoading: false,

//   // Error states
//   error: null,
//   submitError: null,
//   myDoubtsError: null,
//   allDoubtsError: null,

//   // Success states
//   submitSuccess: false,

//   // Pagination (if needed)
//   pagination: {
//     allDoubts: {
//       currentPage: 1,
//       totalPages: 1,
//       totalItems: 0,
//     },
//     myDoubts: {
//       currentPage: 1,
//       totalPages: 1,
//       totalItems: 0,
//     }
//   }
// };

// // ✅ Slice
// const doubtSolutionSlice = createSlice({
//   name: 'doubtSolution',
//   initialState,
//   reducers: {
//     // Clear errors
//     clearError: (state) => {
//       state.error = null;
//       state.submitError = null;
//       state.myDoubtsError = null;
//       state.allDoubtsError = null;
//     },

//     clearSubmitError: (state) => {
//       state.submitError = null;
//     },

//     clearMyDoubtsError: (state) => {
//       state.myDoubtsError = null;
//     },

//     clearAllDoubtsError: (state) => {
//       state.allDoubtsError = null;
//     },

//     // Clear success states
//     clearSubmitSuccess: (state) => {
//       state.submitSuccess = false;
//     },

//     // Reset entire state
//     resetDoubtState: (state) => {
//       return initialState;
//     },

//     // Add new doubt to local state (optimistic update)
//     addNewDoubt: (state, action) => {
//       const newDoubt = action.payload;
//       state.myDoubts.unshift(newDoubt); // Add to beginning
//       state.allDoubts.unshift(newDoubt); // Add to beginning
//     },

//     // Update doubt (for likes, answers count, etc.)
//     updateDoubt: (state, action) => {
//       const { doubtId, updates } = action.payload;

//       // Update in allDoubts
//       const allDoubtIndex = state.allDoubts.findIndex(doubt => doubt.id === doubtId);
//       if (allDoubtIndex !== -1) {
//         state.allDoubts[allDoubtIndex] = { ...state.allDoubts[allDoubtIndex], ...updates };
//       }

//       // Update in myDoubts
//       const myDoubtIndex = state.myDoubts.findIndex(doubt => doubt.id === doubtId);
//       if (myDoubtIndex !== -1) {
//         state.myDoubts[myDoubtIndex] = { ...state.myDoubts[myDoubtIndex], ...updates };
//       }
//     },

//     // Remove doubt (if user deletes)
//     removeDoubt: (state, action) => {
//       const doubtId = action.payload;
//       state.allDoubts = state.allDoubts.filter(doubt => doubt.id !== doubtId);
//       state.myDoubts = state.myDoubts.filter(doubt => doubt.id !== doubtId);
//     }
//   },

//   extraReducers: (builder) => {
//     builder
//       // ✅ Submit Doubt Cases
//       .addCase(doubtSolutionData.pending, (state) => {
//         state.submitLoading = true;
//         state.submitError = null;
//         state.submitSuccess = false;
//         state.loading = true; // General loading for component
//       })
//       .addCase(doubtSolutionData.fulfilled, (state, action) => {
//         state.submitLoading = false;
//         state.submitSuccess = true;
//         state.loading = false;

//         // If API returns the created doubt, add it to state
//         if (action.payload && action.payload.data) {
//           const newDoubt = action.payload.data;
//           state.myDoubts.unshift(newDoubt);
//           state.allDoubts.unshift(newDoubt);
//         }
//       })
//       .addCase(doubtSolutionData.rejected, (state, action) => {
//         state.submitLoading = false;
//         state.submitError = action.payload || 'Failed to submit doubt';
//         state.loading = false;
//         state.submitSuccess = false;
//       })

//       // ✅ Get All Doubts Cases
//       .addCase(allDoubtSolutionData.pending, (state) => {
//         state.allDoubtsLoading = true;
//         state.allDoubtsError = null;
//         state.loading = true; // General loading
//       })
//       .addCase(allDoubtSolutionData.fulfilled, (state, action) => {
//         state.allDoubtsLoading = false;
//         state.loading = false;

//         // Handle different API response structures
//         const responseData = action.payload;

//         if (responseData && responseData.data) {
//           // If response has data property
//           state.allDoubts = Array.isArray(responseData.data) ? responseData.data : [];

//           // Handle pagination if included
//           if (responseData.pagination) {
//             state.pagination.allDoubts = {
//               currentPage: responseData.pagination.current_page || 1,
//               totalPages: responseData.pagination.total_pages || 1,
//               totalItems: responseData.pagination.total_items || responseData.data.length,
//             };
//           }
//         } else if (Array.isArray(responseData)) {
//           // If response is directly an array
//           state.allDoubts = responseData;
//         } else {
//           // Fallback
//           state.allDoubts = [];
//         }
//       })
//       .addCase(allDoubtSolutionData.rejected, (state, action) => {
//         state.allDoubtsLoading = false;
//         state.loading = false;
//         state.allDoubtsError = action.payload || 'Failed to fetch all doubts';
//         state.allDoubts = []; // Clear data on error
//       })

//       // ✅ Get My Doubts Cases
//       .addCase(myDoubtSolutionData.pending, (state) => {
//         state.myDoubtsLoading = true;
//         state.myDoubtsError = null;
//         if (!state.allDoubtsLoading) {
//           state.loading = true; // Only set general loading if all doubts aren't loading
//         }
//       })
//       .addCase(myDoubtSolutionData.fulfilled, (state, action) => {
//         state.myDoubtsLoading = false;

//         // Check if all doubts are also done loading
//         if (!state.allDoubtsLoading) {
//           state.loading = false;
//         }

//         // Handle different API response structures
//         const responseData = action.payload;

//         if (responseData && responseData.data) {
//           // If response has data property
//           state.myDoubts = Array.isArray(responseData.data) ? responseData.data : [];

//           // Handle pagination if included
//           if (responseData.pagination) {
//             state.pagination.myDoubts = {
//               currentPage: responseData.pagination.current_page || 1,
//               totalPages: responseData.pagination.total_pages || 1,
//               totalItems: responseData.pagination.total_items || responseData.data.length,
//             };
//           }
//         } else if (Array.isArray(responseData)) {
//           // If response is directly an array
//           state.myDoubts = responseData;
//         } else {
//           // Fallback
//           state.myDoubts = [];
//         }
//       })
//       .addCase(myDoubtSolutionData.rejected, (state, action) => {
//         state.myDoubtsLoading = false;
//         state.myDoubtsError = action.payload || 'Failed to fetch my doubts';
//         state.myDoubts = []; // Clear data on error

//         // Check if all doubts are also done loading
//         if (!state.allDoubtsLoading) {
//           state.loading = false;
//         }
//       });
//   },
// });

// // ✅ Export actions
// export const {
//   clearError,
//   clearSubmitError,
//   clearMyDoubtsError,
//   clearAllDoubtsError,
//   clearSubmitSuccess,
//   resetDoubtState,
//   addNewDoubt,
//   updateDoubt,
//   removeDoubt
// } = doubtSolutionSlice.actions;

// // ✅ Selectors (optional but helpful)
// export const selectAllDoubts = (state) => state.doubtSolution.allDoubts;
// export const selectMyDoubts = (state) => state.doubtSolution.myDoubts;
// export const selectLoading = (state) => state.doubtSolution.loading;
// export const selectSubmitLoading = (state) => state.doubtSolution.submitLoading;
// export const selectAllDoubtsLoading = (state) => state.doubtSolution.allDoubtsLoading;
// export const selectMyDoubtsLoading = (state) => state.doubtSolution.myDoubtsLoading;
// export const selectError = (state) => state.doubtSolution.error;
// export const selectSubmitError = (state) => state.doubtSolution.submitError;
// export const selectAllDoubtsError = (state) => state.doubtSolution.allDoubtsError;
// export const selectMyDoubtsError = (state) => state.doubtSolution.myDoubtsError;
// export const selectSubmitSuccess = (state) => state.doubtSolution.submitSuccess;
// export const selectPagination = (state) => state.doubtSolution.pagination;

// // ✅ Complex selectors
// export const selectAllDoubtsCount = (state) => state.doubtSolution.allDoubts.length;
// export const selectMyDoubtsCount = (state) => state.doubtSolution.myDoubts.length;
// export const selectIsAnyLoading = (state) =>
//   state.doubtSolution.loading ||
//   state.doubtSolution.submitLoading ||
//   state.doubtSolution.allDoubtsLoading ||
//   state.doubtSolution.myDoubtsLoading;

// export const selectAnyError = (state) =>
//   state.doubtSolution.error ||
//   state.doubtSolution.submitError ||
//   state.doubtSolution.allDoubtsError ||
//   state.doubtSolution.myDoubtsError;

// // ✅ Export reducer as default
// export default doubtSolutionSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DoubtSolution from '../api/DoubtSolution';

// ✅ Async Thunks for API calls
export const doubtSolutionData = createAsyncThunk(
  'doubtSolution/submitDoubt',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await DoubtSolution.postDoubtData(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ Like Doubt Thunk
export const likeDoubtData = createAsyncThunk(
  'doubtSolution/likeDoubt',
  async (solveId, { rejectWithValue }) => {
    try {
      console.log('📤 Redux: Calling Like API for solve_id:', solveId);
      const response = await DoubtSolution.postLikeDoubt(solveId);
      console.log('📥 Redux: Like API Success:', response);

      return {
        solveId,
        likes: response.likes,
        message: response.message
      };
    } catch (error) {
      console.error('📛 Redux: Like API Failed:', error);
      return rejectWithValue(error);
    }
  }
);

// My Doubt Solution
export const myDoubtSolutionData = createAsyncThunk(
  'doubtSolution/getMyDoubts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await DoubtSolution.getMyDoubtData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const allDoubtSolutionData = createAsyncThunk(
  'doubtSolution/getAllDoubts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await DoubtSolution.getAllDoubtData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ Initial State
const initialState = {
  // Data
  allDoubts: [],
  myDoubts: [],

  // Loading states
  loading: false,
  submitLoading: false,
  myDoubtsLoading: false,
  allDoubtsLoading: false,
  likeLoading: false, // ✅ Added like loading

  // Error states
  error: null,
  submitError: null,
  myDoubtsError: null,
  allDoubtsError: null,
  likeError: null, // ✅ Added like error

  // Success states
  submitSuccess: false,
  likeSuccess: false, // ✅ Added like success

  // Pagination (if needed)
  pagination: {
    allDoubts: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
    myDoubts: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    }
  }
};

// ✅ Slice
const doubtSolutionSlice = createSlice({
  name: 'doubtSolution',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.submitError = null;
      state.myDoubtsError = null;
      state.allDoubtsError = null;
      state.likeError = null; // ✅ Added
    },

    clearSubmitError: (state) => {
      state.submitError = null;
    },

    clearMyDoubtsError: (state) => {
      state.myDoubtsError = null;
    },

    clearAllDoubtsError: (state) => {
      state.allDoubtsError = null;
    },

    clearLikeError: (state) => { // ✅ Added
      state.likeError = null;
    },

    // Clear success states
    clearSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },

    clearLikeSuccess: (state) => { // ✅ Added
      state.likeSuccess = false;
    },

    // Reset entire state
    resetDoubtState: (state) => {
      return initialState;
    },

    // Add new doubt to local state (optimistic update)
    addNewDoubt: (state, action) => {
      const newDoubt = action.payload;
      state.myDoubts.unshift(newDoubt);
      state.allDoubts.unshift(newDoubt);
    },

    // Update doubt (for likes, answers count, etc.)
    updateDoubt: (state, action) => {
      const { doubtId, updates } = action.payload;

      // Update in allDoubts
      const allDoubtIndex = state.allDoubts.findIndex(doubt => doubt.id === doubtId);
      if (allDoubtIndex !== -1) {
        state.allDoubts[allDoubtIndex] = { ...state.allDoubts[allDoubtIndex], ...updates };
      }

      // Update in myDoubts
      const myDoubtIndex = state.myDoubts.findIndex(doubt => doubt.id === doubtId);
      if (myDoubtIndex !== -1) {
        state.myDoubts[myDoubtIndex] = { ...state.myDoubts[myDoubtIndex], ...updates };
      }
    },

    // Remove doubt (if user deletes)
    removeDoubt: (state, action) => {
      const doubtId = action.payload;
      state.allDoubts = state.allDoubts.filter(doubt => doubt.id !== doubtId);
      state.myDoubts = state.myDoubts.filter(doubt => doubt.id !== doubtId);
    }
  },

  extraReducers: (builder) => {
    builder
      // ✅ Submit Doubt Cases
      .addCase(doubtSolutionData.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = false;
        state.loading = true;
      })
      .addCase(doubtSolutionData.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        state.loading = false;

        if (action.payload && action.payload.data) {
          const newDoubt = action.payload.data;
          state.myDoubts.unshift(newDoubt);
          state.allDoubts.unshift(newDoubt);
        }
      })
      .addCase(doubtSolutionData.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload || 'Failed to submit doubt';
        state.loading = false;
        state.submitSuccess = false;
      })

      // ✅ Get All Doubts Cases
      .addCase(allDoubtSolutionData.pending, (state) => {
        state.allDoubtsLoading = true;
        state.allDoubtsError = null;
        state.loading = true;
      })
      .addCase(allDoubtSolutionData.fulfilled, (state, action) => {
        state.allDoubtsLoading = false;
        state.loading = false;

        const responseData = action.payload;

        if (responseData && responseData.data) {
          state.allDoubts = Array.isArray(responseData.data) ? responseData.data : [];

          if (responseData.pagination) {
            state.pagination.allDoubts = {
              currentPage: responseData.pagination.current_page || 1,
              totalPages: responseData.pagination.total_pages || 1,
              totalItems: responseData.pagination.total_items || responseData.data.length,
            };
          }
        } else if (Array.isArray(responseData)) {
          state.allDoubts = responseData;
        } else {
          state.allDoubts = [];
        }
      })
      .addCase(allDoubtSolutionData.rejected, (state, action) => {
        state.allDoubtsLoading = false;
        state.loading = false;
        state.allDoubtsError = action.payload || 'Failed to fetch all doubts';
        state.allDoubts = [];
      })

      // ✅ Get My Doubts Cases
      .addCase(myDoubtSolutionData.pending, (state) => {
        state.myDoubtsLoading = true;
        state.myDoubtsError = null;
        if (!state.allDoubtsLoading) {
          state.loading = true;
        }
      })
      .addCase(myDoubtSolutionData.fulfilled, (state, action) => {
        state.myDoubtsLoading = false;

        if (!state.allDoubtsLoading) {
          state.loading = false;
        }

        const responseData = action.payload;

        if (responseData && responseData.data) {
          state.myDoubts = Array.isArray(responseData.data) ? responseData.data : [];

          if (responseData.pagination) {
            state.pagination.myDoubts = {
              currentPage: responseData.pagination.current_page || 1,
              totalPages: responseData.pagination.total_pages || 1,
              totalItems: responseData.pagination.total_items || responseData.data.length,
            };
          }
        } else if (Array.isArray(responseData)) {
          state.myDoubts = responseData;
        } else {
          state.myDoubts = [];
        }
      })
      .addCase(myDoubtSolutionData.rejected, (state, action) => {
        state.myDoubtsLoading = false;
        state.myDoubtsError = action.payload || 'Failed to fetch my doubts';
        state.myDoubts = [];

        if (!state.allDoubtsLoading) {
          state.loading = false;
        }
      })

      // ✅ LIKE DOUBT CASES - ADD THIS
      .addCase(likeDoubtData.pending, (state) => {
        state.likeLoading = true;
        state.likeError = null;
        state.likeSuccess = false;
      })
      .addCase(likeDoubtData.fulfilled, (state, action) => {
        state.likeLoading = false;
        state.likeSuccess = true;

        const { solveId, likes } = action.payload;

        // ✅ Update likes count in both lists using solution.id
        const updateLikes = (doubt) => {
          if (doubt.solution && doubt.solution.id === solveId) {
            return {
              ...doubt,
              solution: {
                ...doubt.solution,
                likes: likes,
                isLiked: true
              }
            };
          }
          return doubt;
        };

        state.allDoubts = state.allDoubts.map(updateLikes);
        state.myDoubts = state.myDoubts.map(updateLikes);
      })
      .addCase(likeDoubtData.rejected, (state, action) => {
        state.likeLoading = false;
        state.likeError = action.payload || 'Failed to like doubt';
        state.likeSuccess = false;
      });
  },
});

// ✅ Export actions
export const {
  clearError,
  clearSubmitError,
  clearMyDoubtsError,
  clearAllDoubtsError,
  clearLikeError, // ✅ Added
  clearSubmitSuccess,
  clearLikeSuccess, // ✅ Added
  resetDoubtState,
  addNewDoubt,
  updateDoubt,
  removeDoubt
} = doubtSolutionSlice.actions;

// ✅ Selectors (optional but helpful)
export const selectAllDoubts = (state) => state.doubtSolution.allDoubts;
export const selectMyDoubts = (state) => state.doubtSolution.myDoubts;
export const selectLoading = (state) => state.doubtSolution.loading;
export const selectSubmitLoading = (state) => state.doubtSolution.submitLoading;
export const selectAllDoubtsLoading = (state) => state.doubtSolution.allDoubtsLoading;
export const selectMyDoubtsLoading = (state) => state.doubtSolution.myDoubtsLoading;
export const selectLikeLoading = (state) => state.doubtSolution.likeLoading; // ✅ Added
export const selectError = (state) => state.doubtSolution.error;
export const selectSubmitError = (state) => state.doubtSolution.submitError;
export const selectAllDoubtsError = (state) => state.doubtSolution.allDoubtsError;
export const selectMyDoubtsError = (state) => state.doubtSolution.myDoubtsError;
export const selectLikeError = (state) => state.doubtSolution.likeError; // ✅ Added
export const selectSubmitSuccess = (state) => state.doubtSolution.submitSuccess;
export const selectLikeSuccess = (state) => state.doubtSolution.likeSuccess; // ✅ Added
export const selectPagination = (state) => state.doubtSolution.pagination;

// ✅ Complex selectors
export const selectAllDoubtsCount = (state) => state.doubtSolution.allDoubts.length;
export const selectMyDoubtsCount = (state) => state.doubtSolution.myDoubts.length;
export const selectIsAnyLoading = (state) =>
  state.doubtSolution.loading ||
  state.doubtSolution.submitLoading ||
  state.doubtSolution.allDoubtsLoading ||
  state.doubtSolution.myDoubtsLoading ||
  state.doubtSolution.likeLoading; // ✅ Added

export const selectAnyError = (state) =>
  state.doubtSolution.error ||
  state.doubtSolution.submitError ||
  state.doubtSolution.allDoubtsError ||
  state.doubtSolution.myDoubtsError ||
  state.doubtSolution.likeError; // ✅ Added

// ✅ Export reducer as default
export default doubtSolutionSlice.reducer;
