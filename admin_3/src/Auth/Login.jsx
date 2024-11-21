import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const { handleLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7059/api/auth/login",
        { username, password },
        {
          withCredentials: true,
        }
      );

      handleLogin(response.data.accessToken, response.data.refreshToken, navigate);
    } catch (err) {
      console.error("Ошибка при входе:", err);

      if (err.response?.status === 401) {
        setError("Неверное имя пользователя или пароль.");
      } else if (err.response?.status === 403) {
        setError("Доступ запрещен. Только для администраторов.");
      } else {
        setError("Ошибка авторизации. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get("AdminAccessToken");
    if (accessToken) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Введите имя пользователя"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Введите пароль"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-black hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;