import axiosClient from "./axiosClient";
import { Song } from "@/types/player";

export const songApi = {
  getSongs: (): Promise<Song[]> => {
    return axiosClient.get("/songs");
  },
  getTopSong: (): Promise<Song> => {
    return axiosClient.get("/songs/top");
  },
};
