import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 60000,
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Auto detect FormData and remove Content-Type so browser can set boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data !== undefined) {
      if (typeof response.data.success === "boolean" && response.data.success) {
        return response.data.data;
      }
      return response.data;
    }
    return response;
  },
  (error) => {
    let message = "Có lỗi xảy ra, vui lòng thử lại.";

    if (error.response) {
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          window.location.href = "/"; 
        }
      }
      if (error.response.data) {
        const data = error.response.data;
        message = data.message || (data.errors && data.errors[Object.keys(data.errors)[0]][0]) || message;
      }
    }

    error.message = message;
    return Promise.reject(error);
  },
);

export default axiosClient;
