import api from "./axiosConfig";

const freeTestProvider = {

  freeTestGet: async () => {
    const res = await api.get("/all-free-test-package");
    return res.data;
  },
  getTopicWisePaper: async () => {
    try {

      const response = await api.get(`/all-topic-test-series`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAllPreviouseYearData: async (page) => {
    try {

      const response = await api.get(`/all-previouse-exam?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPreviouseYearPaperQuestionById: async (previousPaperId) => {
    // console.log("previousPaperId", previousPaperId)
    try {

      const response = await api.get(`/previous-year-question-list-get?previous_year_exam_id=${previousPaperId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  attendPreviouseYearQuestions: async (previouseYearSubmitData) => {
    try {
      const response = await api.post(`/user-attend-previous-year-exam`, previouseYearSubmitData,);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPreviouseYearPaperRank: async (previousPaperId) => {
    try {


      const response = await api.get(`/user-attend-previous-year-exam-rank-get?previous_year_exam_id=${previousPaperId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

}

export default freeTestProvider