import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
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

// Main API Instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Wait 60s for Render to wake up
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
    // If server takes too long, Axios throws a ECONNABORTED error
    if (error.code === 'ECONNABORTED') {
      console.error("The request timed out. Render is likely waking up.");
    }
    
    if (error?.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async (config) => {
    const response = await api(config);
    return response.data;
  };

export default api;

// Token-specific Instance Creator
export const createApiWithToken = (token) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // Match the 60s timeout here
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        redirectToLogin();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};