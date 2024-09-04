import axios from "@/lib/axios";
import { cache } from "react";

export const getList = cache(() => {
  return axios.get("/music");
});
