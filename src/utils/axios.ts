/** @format */

import axios from 'axios';


export const getAuthToken = () => localStorage.getItem('authToken');
export const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
export const removeAuthToken = () => localStorage.removeItem('authToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (token: string) => localStorage.setItem('refreshToken', token);
export const removeRefreshToken = () => localStorage.removeItem('refreshToken');

const apiConfig = {
  baseURL: process.env.REACT_APP_BASE_URI,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

// const logout = () => {
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("rereshToken");
//   localStorage.removeItem("user");
//   window.location.href = "/login";
// };


// Track token refresh
let isRefreshing = false;
let subscribers: any = [];
// Add subscriber (queues requests while waiting for token refresh)
const addSubscriber = (callback: any) => {
  subscribers.push(callback);
};
// Notify all subscribers with the new token
const notifySubscribers = (newToken: any) => {
  subscribers.forEach((callback: any) => callback(newToken));
  subscribers = [];
};


const axiosClient = axios.create(apiConfig);

axiosClient.interceptors.request.use(
  async (config: any) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: any) => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // If token expired, refresh it
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios.post(`${process.env.REACT_APP_BASE_URI}/Auth/refresh`, {
            refreshToken: localStorage.getItem('refreshToken'),
          });
          const newToken = response.data.accessToken;

          setAuthToken(newToken); // Save the new token
          isRefreshing = false;
          notifySubscribers(newToken); // Notify queued requests
        } catch (err) {
          isRefreshing = false;
          removeAuthToken(); // Clear tokens if refresh fails
          window.location.href = '/login'; // Redirect to login
          return Promise.reject(err);
        }
      }

      // Queue the request until the token is refreshed
      return new Promise((resolve) => {
        addSubscriber((newToken: any) => {
          originalRequest._retry = true; // Prevent looping
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axios(originalRequest)); // Retry request
        });
      });
    }

    return Promise.reject(error);
  }
);

export {
  apiConfig,
  // authClient,
  axiosClient,
}
