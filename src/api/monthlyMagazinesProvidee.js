import api from "./axiosConfig";

const monthlyMagazinesProvider = {

  monthlyMagazineGet: async () => {
    const res = await api.get("/monthly-magazine");
    return res.data;
  },
 
}

export default monthlyMagazinesProvider