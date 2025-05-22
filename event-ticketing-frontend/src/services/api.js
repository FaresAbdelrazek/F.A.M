// src/api.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,           // send cookies if you ever switch to cookie auth
  timeout: 10000,                  // optional: 10s timeout for slow connections
});

// Optional: log requests & responses for debugging
// axiosInstance.interceptors.request.use(req => {
//   console.debug('[API Request]', req);
//   return req;
// });
// axiosInstance.interceptors.response.use(
//   res => {
//     console.debug('[API Response]', res);
//     return res;
//   },
//   err => {
//     console.error('[API Error]', err);
//     return Promise.reject(err);
//   }
// );

export default axiosInstance;
