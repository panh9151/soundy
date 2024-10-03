import axios from "@/lib/axios";
import { cache } from "react";

export const getList = () => {
  return axios.get("/sound");
};
