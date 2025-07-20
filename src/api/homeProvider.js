import axios from "axios";

const API_BASE_URL = "https://revision24.com/api";

const HomeProvider = {

    homeData: async (id) => {
        console.log("id---->", id)
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/home-page?exam_category_id=${id}`, {
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

    getSingleCategoryPackageTestseries: async (id, page = 1, search) => {
        console.log("getSingleCategoryPackageTestseries called with id:", id, "page:", page, "search:", search);
        // return
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/test-course-detail-get`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    id,
                    page,       // pass page here
                    search
                },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching testseries:', error);
            throw error;
        }
    },

    getSingleCategoryPackageTestseriesQuestion: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/question-list-get?test_series_id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching testseries questions:', error);
            throw error;
        }
    },


}

export default HomeProvider