import api from "./axiosConfig";

const AttemptedData = {

    getAttemptedTestData: async () => {
        try {
            const res = await api.get("/user-attended-test-series");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getResetTestData:async (testId)=>{
        try{
            const res = await api.get(`/user-attend-test-series-reset?test_id=${testId}`);
            console.log('Reset Test Provider Data', res);
            return res.data;
        }catch(error){
            throw error.response?.data || error.message;
        }
    }
    // ✅ Update your AttemptedData provider
    // getResetTestData: async (testId) => {
    //     try {
    //         // ✅ Get token from localStorage
    //         const token = localStorage.getItem('user_token');
            
    //         if (!token) {
    //             throw new Error('Authentication token not found');
    //         }
            
    //         const res = await api.get(`/user-attend-test-series-reset?test_id=${testId}`, {
    //             headers: { 
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });
            
    //         console.log('Reset Test Provider Data', res);
    //         return res.data;
    //     } catch(error) {
    //         throw error.response?.data || error.message;
    //     }
    // }


}

export default AttemptedData

