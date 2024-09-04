import axios from "@/lib/axios";
import { cache } from "react";

export const getItem = cache(() => {
  return axios.get("/template");
});
