import { useAuth } from "../Contexts/AuthContext";
import React, { useState } from "react";
import axios from "axios";

const ConfirmEmail = () => {
  const { accessToken } = useAuth();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmEmail = async () => {
    setLoading(true);
    setStatus("");

    try {
      console.log("AccessToken:", accessToken);

      const response = await axios.post(
        "https://localhost:7059/api/account/confirmemail",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      console.log("Response from server:", response);
      setStatus(response.data.message || "Confirmation email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      setStatus(
        error.response?.data || "Failed to send confirmation email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Confirm Your Email</h1>
        <p className="text-gray-600 mb-8">
          Click the button below to receive a confirmation link.
        </p>
        <button
          onClick={handleConfirmEmail}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Confirm Email"}
        </button>
        {status && (
          <p className={`text-sm ${status.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
