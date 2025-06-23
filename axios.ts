import axios, { AxiosError } from 'axios';

console.log('Configurando axios com baseURL:', process.env.NEXT_PUBLIC_BACKEND_URL);

const makeRequest = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`, 
  withCredentials: true 
});


makeRequest.interceptors.request.use(
  (config) => {
    console.log('Fazendo requisição para:', config.url);
    console.log('Método:', config.method);
    console.log('Headers:', config.headers);
    
    let token = sessionStorage.getItem("lavacar:token");
    
   
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
      console.log('Token adicionado ao header');
    } else {
      console.log('Nenhum token encontrado');
    }
    
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);


makeRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenta usar o refresh token dos cookies
        const refreshResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
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