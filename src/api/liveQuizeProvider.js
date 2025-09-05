import api from "./axiosConfig";

const liveQuizeTest = {

  getLiveQuiz: async () => {
    const res = await api.get("/mega-quiz-get-live");
    return res.data;
  },

    getMegaQuizAttendQuestion: async (id) => {
        // console.log("getMegaQuizAttendQuestion", id)
        try {
            const response = await api.get(`/mega-quiz-question-get?quiz_id=${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

  megaQuizResult: async (id) => {
    // console.log("getMegaQuizAttendQuestion", id)
    try {
      const response = await api.post(`/mega-quiz-join`, {
        quiz_id: id
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
   megaQuizAttendSubmit: async (megaQuizData) => {
        try {
            const response = await api.post(`/user-attend-mega-quiz`, megaQuizData,);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

}

export default liveQuizeTest