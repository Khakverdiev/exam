import axios from 'axios';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useAxiosInterceptors = () => {
<<<<<<< HEAD
  const { accessToken, refreshAccessToken, handleLogout } = useAuth();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = Cookies.get('AccessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          } catch (tokenError) {
            console.error("Ошибка при обновлении токена:", tokenError);
            handleLogout();
          }
        }

        setHasError(true);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshAccessToken, handleLogout]);

  return hasError;
=======
    const { accessToken, refreshAccessToken, handleLogout } = useAuth();
    const [hasError, setHasError] = useState(false);
  
    useEffect(() => {
      const requestInterceptor = axios.interceptors.request.use(
        (config) => {
          const token = Cookies.get('AccessToken');
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
  
      const responseInterceptor = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
  
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const newAccessToken = await refreshAccessToken();
              if (newAccessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
              }
            } catch (tokenError) {
              console.error("Ошибка при обновлении токена:", tokenError);
              handleLogout();
            }
          }
  
          setHasError(true);
          return Promise.reject(error);
        }
      );

      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }, [accessToken, refreshAccessToken, handleLogout]);
  
    return hasError;
>>>>>>> 142cee9230816675b04e1a7d72b1eb735d56392a
};

export default useAxiosInterceptors;