import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import DropIn from "braintree-web-drop-in-react";
import { useNavigate } from "react-router-dom";
import {
  setFirstName,
  setLastName,
  setAddress,
  setZipCode,
  setPhoneNumber,
  setError,
  setSuccessMessage,
  setOrderDetails,
  resetOrder,
  setSelectedCity,
} from "../features/order/orderSlice";

const Order = () => {
  const { accessToken, username } = useAuth();
  const dispatch = useDispatch();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const {
    firstName,
    lastName,
    address,
    zipCode,
    phoneNumber,
    error,
    successMessage,
    selectedCity,
    orderDetails,
  } = useSelector((state) => state.order);

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const citiesOfAzerbaijan = ["Baku", "Ganja", "Sumqayit", "Mingachevir", "Shirvan", "Lankaran", "Nakhchivan", "Sheki"];

  const phoneNumberRegex = /^\+994\s(50|51|55|70|77)\s\d{3}\s\d{2}\s\d{2}$/;

  const validatePhoneNumber = (phoneNumber) => phoneNumberRegex.test(phoneNumber);

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, "");
    let formatted = "+994 ";

    if (cleaned.length > 3) {
      formatted += cleaned.substring(3, 5) + " ";
    }
    if (cleaned.length > 5) {
      formatted += cleaned.substring(5, 8) + " ";
    }
    if (cleaned.length > 8) {
      formatted += cleaned.substring(8, 10) + " ";
    }
    if (cleaned.length > 10) {
      formatted += cleaned.substring(10, 12);
    }

    return formatted.trim();
  };

  const handlePhoneNumberChange = (e) => {
    const rawInput = e.target.value;
    const formattedInput = formatPhoneNumber(rawInput);

    if (!validatePhoneNumber(formattedInput)) {
      dispatch(setError("Invalid phone number format. Use +994 XX XXX XX XX"));
    } else {
      dispatch(setError(null));
    }

    dispatch(setPhoneNumber(formattedInput));
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await axios.get("https://localhost:7193/api/payment/generate-client-token", {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setClientToken(response.data.clientToken);
      } catch (error) {
        console.error("Error fetching client token:", error);
        dispatch(setError("Failed to generate client token."));
      }
    };

    if (accessToken) {
      fetchClientToken();
    }
  }, [accessToken, dispatch]);

  const createOrder = async (paymentId) => {
    const orderData = {
      Username: username,
      OrderItems: cartItems.map((item) => ({
        Id: item.id,
        OrderId: item.orderId,
        ProductId: item.productId,
        Quantity: item.quantity,
        Price: item.price,
        Size: item.size,
      })),
      ShippingAddress: {
        Id: 0,
        Country: "Azerbaijan",
        City: selectedCity,
        FirstName: firstName,
        LastName: lastName,
        Address: address,
        ZipCode: zipCode,
        PhoneNumber: phoneNumber,
      },
      OrderStatusId: 1,
      PaymentId: paymentId,
    };

    try {
      const response = await axios.post("https://localhost:7193/api/order/create", orderData, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      const orderId = response.data.id;
      dispatch(setSuccessMessage("Order created successfully!"));
      clearCart();
      navigate(`/receipt/${orderId}`);
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error);
      dispatch(setError(error.response?.data || "Failed to create order. Please try again."));
    }
  };

  const processPayment = async (nonce) => {
    const paymentData = {
      paymentMethodNonce: nonce,
      amount: calculateTotalAmount(),
    };

    try {
      const response = await axios.post("https://localhost:7193/api/payment/create-transaction", paymentData, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (response.data && response.data.PaymentDetails) {
        setPaymentId(response.data.PaymentDetails.Id);
      }

      return response.data;
    } catch (error) {
      console.error("Error processing payment:", error);
      dispatch(setError("Payment processing error. Please try again."));
    }
  };

  const handlePurchase = async () => {
    if (!instance) return;

    try {
      const { nonce } = await instance.requestPaymentMethod();
      const paymentResponse = await processPayment(nonce);

      if (paymentResponse.message === "Transaction successful" && paymentResponse.paymentDetails.id) {
        await createOrder(paymentResponse.paymentDetails.id);
        dispatch(resetOrder());
      } else {
        dispatch(setError("Transaction failed. Please try again."));
      }
    } catch (error) {
      console.error("Error completing purchase:", error);
      dispatch(setError("Purchase failed. Please try again."));
    }
  };

  useEffect(() => {
    setIsFormComplete(
      selectedCity && firstName && lastName && address && zipCode && validatePhoneNumber(phoneNumber)
    );
  }, [selectedCity, firstName, lastName, address, zipCode, phoneNumber]);

  return (
    <>
    <br></br>
    <br></br>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center px-4 py-8">
      <div className="container max-w-4xl bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Place Your Order</h1>
  
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
  
        <form className="bg-gray-700 p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Select City</label>
            <select
              value={selectedCity}
              onChange={(e) => dispatch(setSelectedCity(e.target.value))}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            >
              <option value="">Select a city...</option>
              {citiesOfAzerbaijan.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => dispatch(setFirstName(e.target.value))}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => dispatch(setLastName(e.target.value))}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>
  
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => dispatch(setAddress(e.target.value))}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold mb-2">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => dispatch(setZipCode(e.target.value))}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </form>
  
        <div className="mt-6 bg-gray-700 p-6 rounded-lg shadow-md">
          {clientToken && (
            <DropIn
              options={{ authorization: clientToken }}
              onInstance={(instance) => setInstance(instance)}
            />
          )}
        </div>
  
        <div className="flex justify-center mt-6">
          <button
            onClick={handlePurchase}
            disabled={!isFormComplete || !instance}
            className={`w-full py-3 rounded-lg font-bold text-white ${
              isFormComplete
                ? "bg-blue-600 hover:bg-blue-700 transition duration-300"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Complete Purchase
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Order;