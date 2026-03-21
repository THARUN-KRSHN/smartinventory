import axios from "axios";

const BASE_URL = "https://db-project-backend-2ull.onrender.com";
const LOGIN_ROUTE = "/login";

const TOKEN_KEYS = ["token", "jwt", "jwtToken", "accessToken"];

const getJwtToken = () => {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

const redirectToLogin = () => {
  if (window.location.pathname !== LOGIN_ROUTE) {
    window.location.href = LOGIN_ROUTE;
  }
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getJwtToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default api;
