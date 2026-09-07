import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    let message = 'Có lỗi xảy ra, vui lòng thử lại.';
    
    if (error.response && error.response.data) {
      const data = error.response.data;
      message = data.message || 
                (data.errors && data.errors[Object.keys(data.errors)[0]][0]) ||
                message;
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
