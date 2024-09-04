import axios from "@/lib/axios";
import { cache } from "react";

export const getDefaultItem = cache(() => {
  return axios.get("/scenario/default");
});
