import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-gray-600 mb-8">Manage your account settings</p>
        
        <button
          onClick={() => navigate("/profile/confirm-email")}
          className="w-full bg-black text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 transition duration-300"
        >
          Confirm Email
        </button>
        
        <button
          onClick={() => navigate("/profile/change-password")}
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;