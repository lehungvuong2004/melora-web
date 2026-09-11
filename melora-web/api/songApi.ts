import axiosClient from "./axiosClient";
import { Song } from "@/types/player";

export const songApi = {
  getSongs: async (): Promise<Song[]> => {
    const res: unknown = await axiosClient.get("/songs");
    const data = res as Record<string, unknown>;
    return data.data && Array.isArray(data.data) ? (data.data as Song[]) : Array.isArray(data) ? data : [];
  },
  getTopSong: async (): Promise<Song> => {
    const res: unknown = await axiosClient.get("/songs/top");
    const data = res as Record<string, unknown>;
    const arrayData = data.data && Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : data ? [data] : [];
    return arrayData.length > 0 ? (arrayData[0] as Song) : (data as Song);
  },
};
