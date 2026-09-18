import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let csrfToken = "";

const fetchCsrfToken = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/csrf`, {
    withCredentials: true,
  });

  csrfToken = response.data.csrfToken;
  return csrfToken;
};

api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase() || "get";

    if (!["get", "head", "options"].includes(method)) {
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;