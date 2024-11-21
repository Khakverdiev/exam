import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const NewPassword = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setMessage("");
      setLoading(true);
          
      const token = searchParams.get("token");
      const username = searchParams.get("username");
          
      if (!token || !username) {
        setError("Invalid reset link.");
        setLoading(false);
        return;
      }
  
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
  
      try {
        await axios.post("https://localhost:7059/api/account/resetpasswordwithoutoldpassword", {
          token,
          username,
          newPassword,
          confirmNewPassword: confirmPassword,
        });
        setMessage("Password has been reset successfully.");
      } catch (err) {
        console.error("Error in Reset Password:", err);
        if (err.response?.status === 400) {
          setError("Invalid token or expired link.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Confirm new password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-black hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default NewPassword;