import axios, { AxiosError } from 'axios';

const makeRequest = axios.create({
  baseURL: "http://localhost:8003/api", 
  withCredentials: true // Importante para enviar cookies
});

// Interceptor para adicionar token do sessionStorage OU dos cookies
makeRequest.interceptors.request.use(
  (config) => {
    // Primeiro tenta pegar do sessionStorage
    let token = sessionStorage.getItem("lavacar:token");
    
    // Se não tiver no sessionStorage, tenta extrair dos cookies (para desenvolvimento)
    if (!token) {
      const cookies = document.cookie.split(';');
      const accessTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('accessToken=')
      );
      if (accessTokenCookie) {
        token = accessTokenCookie.split('=')[1];
      }
    }
    
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com respostas e erros de autenticação
makeRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenta usar o refresh token dos cookies
        const refreshResponse = await axios.get(
          'http://localhost:8003/api/auth/refresh',
          { withCredentials: true }
        );
        
        if (refreshResponse.data.tokens?.accessToken) {
          const newToken = refreshResponse.data.tokens.accessToken;
          sessionStorage.setItem("lavacar:token", newToken);
          
          // Refaz a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return makeRequest(originalRequest);
        }
      } catch (refreshError) {
        // Se o refresh falhar, não faz logout automático
        console.error('Erro ao renovar token:', refreshError);
        
        // Se for erro 401 no refresh, limpa os dados locais e redireciona para login
        if (refreshError instanceof AxiosError) {
          if (refreshError.response?.status === 401) {
            console.log('Refresh token inválido, limpando dados locais');
            
            // Limpa dados locais
            sessionStorage.removeItem("lavacar:token");
            sessionStorage.removeItem("lavacar:user");
            localStorage.removeItem("lavacar:user");
            
            // Limpa cookies do lado cliente (se possível)
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            // Redireciona para login apenas se não estiver já na página de login
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export { makeRequest };