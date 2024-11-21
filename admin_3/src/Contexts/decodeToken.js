import { jwtDecode } from "jwt-decode";

export default function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    return {
        sub: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        exp: decoded.exp || null, 
    };
  } catch (error) {
    return null;
  }
}