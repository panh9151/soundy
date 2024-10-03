import axios from "@/lib/axios";

export const getList = () => {
  return axios.get("/music");
};
