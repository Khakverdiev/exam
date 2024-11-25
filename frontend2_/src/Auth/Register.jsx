import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const usernamePattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[_*&%$#@]).{5,}$/;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateUsername = (username) => {
        return usernamePattern.test(username);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }   

        if (!validateUsername(name)) {
            setError(
              "Username must contain at least one uppercase letter, one lowercase letter, one special character (_*&%$#@), and be at least 5 characters long."
            );
            return;
        }
      
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("https://localhost:7059/api/auth/register", {
              username: name,
              email: email,
              password: password,
              confirmPassword: confirmPassword
            }, { withCredentials: true });

            if (response.status === 200) {
                alert("Registration successful! Please check your email to confirm.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error during registration:", error);

            if (error.response && error.response.status === 400) {
                setError("Invalid input data. Please check your username, email, or password.");
            } else if (error.response && error.response.status === 500) {
                setError("Server error. Please try again later.");
            } else {
                setError("Registration failed. Please check your input.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md transform transition duration-500 hover:shadow-2xl animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Username
              </label>
              <div className="flex items-center border rounded w-full py-2 px-3 focus-within:ring-2 focus-within:ring-purple-500">
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="outline-none w-full text-gray-700"
                  placeholder="Your Username"
                  required
                />
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <div className="flex items-center border rounded w-full py-2 px-3 focus-within:ring-2 focus-within:ring-purple-500">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline-none w-full text-gray-700"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="flex items-center border rounded w-full py-2 px-3 focus-within:ring-2 focus-within:ring-purple-500">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="outline-none w-full text-gray-700"
                  placeholder="********"
                  required
                />
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="flex items-center border rounded w-full py-2 px-3 focus-within:ring-2 focus-within:ring-purple-500">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="outline-none w-full text-gray-700"
                  placeholder="********"
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className={`bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
            <p className="mt-4 text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-purple-500 hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    );
};

export default Register;