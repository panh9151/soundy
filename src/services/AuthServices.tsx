import axios from "@/lib/axios";

export const login = (email: string, password: string) => {
  return axios.post("/login", { email, password });
};

export const forgotPassword = (email: string) => {
  return axios.post("/forgot-password", { email });
};

export const resetPassword = (newPassword: string, token: string) => {
  return axios.post("/reset-password/" + token, { newPassword });
};
