import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7059/api/account/forgotpassword",
        { email }
      );

      setMessage("Password reset link has been sent to your email.");
    } catch (err) {
      console.error("Error:", err);

      if (err.response?.status === 404) {
        setError("Email not found.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-gray-700 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm transform transition duration-500 hover:shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center border rounded w-full py-2 px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none w-full text-gray-700"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
          <div className="flex items-center justify-center mb-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleBackClick}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition-transform transform hover:scale-105"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;