import axios from "@/lib/axios";
import { cache } from "react";

export const getList = cache(() => {
  return axios.get("/type");
});

export const getSoundType = cache(() => {
  return axios.get("/type?type=sound");
});

export const getMusicType = cache(() => {
  return axios.get("/type?type=music");
});
