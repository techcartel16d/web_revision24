import api from "./axiosConfig";

const FreeQuizeProvider = {

   getFreeQuizeData: async () => {
        try {
           

            const res = await api.get("/all-free-test-series");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
 
}

export default FreeQuizeProvider