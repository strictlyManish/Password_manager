import axios from "axios";

const normalizeBaseUrl = (value = "") => value.replace(/\/+$/, "");

const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || "https://password-manager-mu-ashen.vercel.app"
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let csrfToken = "";

const fetchCsrfToken = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth/csrf`, {
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