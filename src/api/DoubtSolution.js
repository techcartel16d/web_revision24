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


