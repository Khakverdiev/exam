import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { accessToken, userId } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`https://localhost:7131/api/UserProfile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        const { firstName, lastName, phoneNumber, address, city, country, postalCode } = response.data;
        setFirstName(firstName);
        setLastName(lastName);
        setAddress(address);
        setCity(city);
        setCountry(country);
        setPostalCode(postalCode);
        setPhoneNumber(phoneNumber);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, accessToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col min-h-screen pt-16"> {/* Adjusted padding here */}
      <div className="container mx-auto p-4 sm:p-6 flex-grow">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">User Profile</h1>
        <div className="bg-gray-100 shadow-lg rounded-lg p-4 sm:p-8 max-w-xl mx-auto">
          <p className="mb-4">
            <strong>First Name:</strong> {firstName}
          </p>
          <p className="mb-4">
            <strong>Last Name:</strong> {lastName}
          </p>
          <p className="mb-4">
            <strong>Address:</strong> {address}
          </p>
          <p className="mb-4">
            <strong>City:</strong> {city}
          </p>
          <p className="mb-4">
            <strong>Country:</strong> {country}
          </p>
          <p className="mb-4">
            <strong>Postal Code:</strong> {postalCode}
          </p>
          <p className="mb-4">
            <strong>Phone Number:</strong> {phoneNumber}
          </p>
          <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/profile/update-profile")}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Update Profile
            </button>
            <button
              onClick={() => navigate("/profile/confirm-email")}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Confirm Email
            </button>
            <button
              onClick={() => navigate("/profile/change-password")}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile; 