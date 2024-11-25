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

  useEffect(() => {
    if (Cookies.get("UserAccessToken")) {
      navigate("/home");
    }
  }, [navigate]);

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
      } else if (err.response?.status === 500) {
        setError("Ошибка сервера. Попробуйте позже.");
      } else {
        setError("Не удалось выполнить авторизацию. Проверьте данные.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#551a1a] to-black flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm transform transition duration-300 hover:shadow-lg hover:scale-105 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <div className="flex items-center border rounded w-full py-2 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM9 17a6 6 0 016-6h3m-9 0a9 9 0 109 9H9z"
                />
              </svg>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="outline-none w-full text-gray-700 leading-tight"
                placeholder="Введите имя пользователя"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Введите пароль"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs italic mb-4">{error}</p>
          )}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
              transform transition duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-red-400 hover:underline">
              Sign Up
            </a>
          </p>
          <p className="mt-2 text-center text-gray-600 text-sm">
            <a href="/forgot-password" className="text-red-400 hover:underline">
              Forgot Password?
            </a>
          </p>
        </form>
      </div>
    </div>
  );  
};

export default Login;