import axios from "axios";

const API_BASE_URL = "https://revision24.com/api";

const HomeProvider = {

    homeData: async (id) => {
        console.log("id---->", id)
        try {
            const token = localStorage.getItem('token');
            // if (!token) throw new Error('No token found');

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


    getSingleCategoryPackageTestseriesDetails: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/test-series-detail/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching testseries details:', error);
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

    submitAttendQuestions: async (attendQuestion) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${API_BASE_URL}/user-attend-test-series`,
                attendQuestion,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            console.error('Error SUBMIT ATTEND QUESTIONS:', error);
            throw error;
        }
    },



    // GET USER RANK
    getUserTestSeriesRank: async (test_id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/user-attend-test-series-rank-get?test_id=${test_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error TEST SERIES RANK:', error);
            throw error;
        }
    },

    getUserTestSeriesSolution: async (test_id) => {
        console.log("test id ", test_id)
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/user-attend-test-series-question-solution?test_id=${test_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching solution:', error);
            throw error;
        }
    },

    getSubscriptionData: async () => {
        try {
            const token = localStorage.getItem('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/subscriptions`, {
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
    checkoutpay: async (planData) => {
        try {
            const token = localStorage.getItem('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/checkout.pay`,planData, {
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
}

export default HomeProvider