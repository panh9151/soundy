import axios from "@/lib/axios";
import { cache } from "react";

export const getList = () => {
  return axios.get("/type");
};

export const getSoundType = () => {
  return axios.get("/type?type=sound");
};

export const getMusicType = () => {
  return axios.get("/type?type=music");
};
