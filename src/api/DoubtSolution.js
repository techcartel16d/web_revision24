import api from './axiosConfig';


const DoubtSolution = {
    // Doubt Submit
    postDoubtData: async (formData) => {
        try {
            const res = await api.post("/user-doubt-submit", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Like Doubt
    // postLikeDoubt: async (doubtId) => {
    //     try{
    //         const res = await api.post("/like-doubt-solve", doubtId,{
    //             headers : {
    //                 'Content-Type' : 'multipart/form-data',
    //             },
    //         })
    //     }catch(error){
    //         throw error.response?.data || error.message;
    //     }
    // },
    // ✅ FIXED: Like Doubt with FormData
    postLikeDoubt: async (solveId) => {
        try {
            console.log('🔥 API Call - solve_id:', solveId, 'type:', typeof solveId);

            // ✅ Create FormData properly
            const formData = new FormData();
            formData.append('solve_id', String(solveId));
            formData.append('action', 'like');

            // Debug: Check FormData contents
            console.log('📤 FormData being sent:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}: "${value}" (${typeof value})`);
            }

            const res = await api.post("/like-doubt-solve", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ API Success:', res.data);
            return res.data;

        } catch (error) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw error.response?.data || error.message;
        }
    },

    // My Doubt Data
    getMyDoubtData: async () => {
        try {
            const res = await api.get("/my-doubt-list");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // All Doubt Data
    getAllDoubtData: async () => {
        try {
            const res = await api.get("/all-doubt-list");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default DoubtSolution;


