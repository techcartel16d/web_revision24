import api from "./axiosConfig";

const liveQuizeTest = {

  getLiveQuiz: async () => {
    const res = await api.get("/mega-quiz-get-live");
    return res.data;
  },

}

export default liveQuizeTest