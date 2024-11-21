import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import decodeToken from "./decodeToken";
import { setTokens, getTokens, clearTokens } from "./tokenUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const port = window.location.port;

    const [authState, setAuthState] = useState({
        accessToken: getTokens(port).accessToken || null,
        refreshToken: getTokens(port).refreshToken || null,
        isLoading: false,
        error: null,
    });

    const decodedToken = authState.accessToken ? decodeToken(authState.accessToken) : null;
    const username = decodedToken?.sub || null;
    const role = decodedToken?.role || null;
    const expirationTime = decodedToken?.exp ? decodedToken.exp * 1000 : null; 

    useEffect(() => {
        if (role && role !== "AppUser") {
            handleLogout();
        }
    }, [role]);

    useEffect(() => {
        const checkTokenExpiry = async () => {
            const { accessToken } = getTokens(port);

            if (!accessToken) {
                return;
            }

            const decoded = decodeToken(accessToken);
            if (!decoded || !decoded.exp) {
                return;
            }

            const expirationTime = decoded.exp * 1000;
            const timeToExpiry = expirationTime - Date.now();

            if (timeToExpiry <= 2 * 60 * 1000) {
                await refreshAccessToken();
            }
        };

        const intervalId = setInterval(checkTokenExpiry, 30 * 1000);

        checkTokenExpiry();

        return () => clearInterval(intervalId);
    }, [port, authState.accessToken]);

    useEffect(() => {
        const setupAxiosInterceptors = () => {
            axios.interceptors.request.use(
                (config) => {
                    const { accessToken } = getTokens(port);
                    if (accessToken) {
                        config.headers["Authorization"] = `Bearer ${accessToken}`;
                    } else {
                        console.warn("AccessToken отсутствует, заголовок Authorization не добавлен.");
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            axios.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const originalRequest = error.config;

                    if (error.response?.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;

                        const newAccessToken = await refreshAccessToken();
                        if (newAccessToken) {
                            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                            return axios(originalRequest);
                        } else {
                            console.error("Не удалось обновить токен. Прекращаем повтор запроса.");
                        }
                    }

                    return Promise.reject(error);
                }
            );
        };

        setupAxiosInterceptors();
    }, [port]);

    const refreshAccessToken = async () => {
        const { accessToken, refreshToken } = getTokens(port);

        if (!refreshToken || !accessToken) {
            return null;
        }

        setAuthState((prevState) => ({ ...prevState, isLoading: true }));

        try {
            const response = await axios.post("https://localhost:7059/api/auth/refresh", {
                accessToken: accessToken,
                refreshToken: refreshToken,
            });

            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            setTokens(newAccessToken, newRefreshToken, port);

            setAuthState((prevState) => ({
                ...prevState,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                isLoading: false,
            }));

            return newAccessToken;
        } catch (error) {
            setAuthState((prevState) => ({
                ...prevState,
                error: "Ошибка обновления токена",
                isLoading: false,
            }));
            handleLogout();
            return null;
        }
    };

    const handleLogin = (accessToken, refreshToken, navigate) => {
        const decoded = decodeToken(accessToken);
        if (decoded?.role !== "AppUser") {
            handleLogout();
            return;
        }

        setTokens(accessToken, refreshToken, port);

        setAuthState({
            accessToken,
            refreshToken,
            isLoading: false,
            error: null,
        });

        navigate("/home");
    };

    const handleLogout = () => {
        clearTokens(port);

        setAuthState({
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
        });
    };

    const value = useMemo(
        () => ({
            ...authState,
            username,
            role,
            handleLogin,
            handleLogout,
            refreshAccessToken,
        }),
        [authState, username, role]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);