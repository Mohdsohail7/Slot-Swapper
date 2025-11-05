import axios from 'axios';

// Create Axios instance
const apiAxios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
  withCredentials: true, 
});

// interceptors for adding tokens automatically
apiAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiAxios;