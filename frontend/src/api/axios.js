import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/", // Ensure this matches your backend URL precisely
  headers: {
    "Content-Type": "application/json",
    
  },
  withCredentials:true
});

api.interceptors.request.use(
  (config) => {
    // Dynamically grab the token on EVERY request
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;