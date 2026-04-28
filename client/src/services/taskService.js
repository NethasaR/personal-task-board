import axios from "axios";

const API = "http://localhost:5000/api/tasks";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

export const getTasks = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.status) {
    queryParams.append("status", filters.status);
  }

  if (filters.priority) {
    queryParams.append("priority", filters.priority);
  }

  const queryString = queryParams.toString();

  const res = await axios.get(queryString ? `${API}?${queryString}` : API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const createTask = async (data) => {
  const res = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};