import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',  // only one /api/v1 here
  withCredentials: true,                    // allow cookies to be sent
});

export default axiosInstance;
