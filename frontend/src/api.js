import axios from 'axios';

// Create an instance of axios
const api = axios.create();

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx
    console.error('API Response Error:', error.response?.data?.message || error.message);
    
    // Handle specific error codes
    if (error.response) {
      if (error.response.status === 401) {
        console.log('Authentication error - you may need to sign in again');
      } else if (error.response.status === 500) {
        console.log('Server error - please try again later');
      }
    } else if (error.request) {
      console.log('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default api;
