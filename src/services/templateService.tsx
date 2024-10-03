import axios from "@/lib/axios";
import { cache } from "react";

export const getItem = () => {
  return axios.get("/template");
};
