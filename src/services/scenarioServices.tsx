import axios from "@/lib/axios";
import { cache } from "react";

export const getDefaultItem = () => {
  return axios.get("/scenario/default");
};

export const getList = () => {
  return axios.get("/scenario");
};
