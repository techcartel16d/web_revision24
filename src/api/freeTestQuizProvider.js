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

  previouseYearSolutionGet: async (previousPaperId) => {

    try {
      const response = await api.get(`/user-attend-previous-year-exam-question-solution?previous_year_exam_id=${previousPaperId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  // getCurrentAffairsData: async () => {
  //   try {


  //     const response = await api.get(`/news`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },
  getCurrentAffairsData: async (page = 1) => {
    try {
      const res = await api.get('/news', {
        params: { page }  // ✅ Pass page as query param
      });
      return res.data;
    } catch (error) {
      console.error('ERROR IN CURRENT AFFAIRS API:', error);
      throw error;
    }
  },

  getMindMap: async () => {
    try {

      const response = await api.get(`/mind-maps`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

}

export default freeTestProvider