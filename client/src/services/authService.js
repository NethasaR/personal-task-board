import axios from "axios";

const API = "https://fundamentals-voting-solutions-but.trycloudflare.com/api/auth";

export const register = async (data) => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
};