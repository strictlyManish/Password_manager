import axios from "axios";

const normalizeBaseUrl = (value = "") => value.replace(/\/+$/, "");

const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || "http://localhost:3000"
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
  try {
    // Make sure path matches your backend route (e.g., /auth/csrf or /csrf)
    const response = await axios.get(`${API_BASE_URL}/auth/csrf`, {
      withCredentials: true,
    });

    csrfToken =
      response.data?.csrfToken ||
      response.data?.token ||
      response.headers["x-csrf-token"] ||
      "";

    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    csrfToken = "";
    throw error;
  }
};

api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase() || "get";

    if (!["get", "head", "options"].includes(method)) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }

      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      csrfToken = "";
      await fetchCsrfToken();
      if (csrfToken) {
        originalRequest.headers["x-csrf-token"] = csrfToken;
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;