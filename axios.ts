import axios from 'axios';

export const makeRequest = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? "https://lavacar.gestaobc.net.br/api"
    : "http://localhost:8003/api",  // Para desenvolvimento
  withCredentials: true,
})
