import Cookies from "js-cookie";

export const setTokens = (accessToken, refreshToken, port) => {
    Cookies.set(`UserAccessToken_${port}`, accessToken, { path: '/', sameSite: 'None', secure: true });
    Cookies.set(`UserRefreshToken_${port}`, refreshToken, { path: '/', sameSite: 'None', secure: true });
};

export const getTokens = (port) => {
    const accessToken = Cookies.get(`UserAccessToken_${port}`);
    const refreshToken = Cookies.get(`UserRefreshToken_${port}`);

    if (!accessToken || !refreshToken) {
        //console.warn("Токены не найдены в cookies.");
    }

    return { accessToken, refreshToken };
};

export const clearTokens = (port) => {
    const accessTokenName = `UserAccessToken_${port}`;
    const refreshTokenName = `UserRefreshToken_${port}`;

    Cookies.remove(accessTokenName, { path: '/' });
    Cookies.remove(refreshTokenName, { path: '/' });
};

export const clearAllTokens = (port) => {
    Cookies.remove(`UserAccessToken_${port}`, { path: '/' });
    Cookies.remove(`UserRefreshToken_${port}`, { path: '/' });
};