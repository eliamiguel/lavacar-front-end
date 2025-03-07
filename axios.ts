import axios from 'axios';

export const makeRequest = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? "https://lavacar.gestaobc.net.br/api"
    : "http://localhost:8003/api",  // Para desenvolvimento
  withCredentials: true,
})



  makeRequest.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("lavacar:token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );