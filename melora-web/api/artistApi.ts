import axiosClient from "./axiosClient";

export const artistApi = {
  getMySongs: (params?: any) => {
    return axiosClient.get("/artist/songs", { params });
  },

  uploadSong: (data: FormData) => {
    return axiosClient.post("/artist/songs", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  updateSong: (id: number, data: any) => {
    return axiosClient.put(`/artist/songs/${id}`, data);
  },

  deleteSong: (id: number) => {
    return axiosClient.delete(`/artist/songs/${id}`);
  },

  getStats: () => {
    return axiosClient.get("/artist/stats");
  },

  getAudience: () => {
    return axiosClient.get("/artist/audience");
  },

  updateProfile: (data: FormData) => {
    return axiosClient.post("/artist/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
};
