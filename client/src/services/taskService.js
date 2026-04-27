import axios from "axios";

const API = "http://localhost:5000/api/tasks";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

export const getTasks = async () => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const createTask = async (data) => {
  const res = await axios.post(API, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};