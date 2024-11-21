import Cookies from "js-cookie";

export const setTokens = (accessToken, refreshToken, port) => {
    Cookies.set(`AdminAccessToken_${port}`, accessToken, { path: '/', sameSite: 'None', secure: true });
    Cookies.set(`AdminRefreshToken_${port}`, refreshToken, { path: '/', sameSite: 'None', secure: true });
};

export const getTokens = (port) => {
    const accessToken = Cookies.get(`AdminAccessToken_${port}`);
    const refreshToken = Cookies.get(`AdminRefreshToken_${port}`)

    if (!accessToken || !refreshToken) {
        console.warn("Токены не найдены в cookies.");
    }

    return { accessToken, refreshToken };
};

export const clearTokens = (port) => {
    const accessTokenName = `AdminAccessToken_${port}`;
    const refreshTokenName = `AdminRefreshToken_${port}`;

    Cookies.remove(accessTokenName, { path: '/' });
    Cookies.remove(refreshTokenName, { path: '/' });
};

export const clearAllTokens = (port) => {
    Cookies.remove(`AdminAccessToken_${port}`, { path: '/' });
    Cookies.remove(`AdminRefreshToken_${port}`, { path: '/' });
};