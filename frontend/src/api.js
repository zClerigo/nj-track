import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ALLOWS FOR IMPORT OF ANYTHING SPECIFIED WITHIN ENVIRONMENT VARIABLE FILE
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN); // PASSES JWT ACCESS TOKEN
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// Handle 401 errors and try to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Prevent infinite loop
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem(REFRESH_TOKEN)
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          { refresh: localStorage.getItem(REFRESH_TOKEN) },
        );
        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or invalid, log out user
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login"; // or your login route
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
