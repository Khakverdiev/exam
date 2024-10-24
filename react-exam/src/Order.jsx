import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useAuth } from './AuthContext';
import {useCart} from "./CartContext";
import {
  setDeliveryCountry,
  setSpecificCountry,
  setFirstName,
  setLastName,
  setAddress,
  setZipCode,
  setPhoneNumber,
  setCardNumber,
  setCardExpiry,
  setCardCVV,
  setError,
  setSuccessMessage,
  setOrderDetails,
  setDeliveryTime,
  resetOrder, setSelectedCity,
} from './features/order/orderSlice';

const Order = () => {
  const { accessToken, userId } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useCart();

  const {
    deliveryCountry,
    specificCountry,
    firstName,
    lastName,
    address,
    zipCode,
    phoneNumber,
    cardNumber,
    cardExpiry,
    cardCVV,
    error,
    successMessage,
    orderDetails,
    deliveryTime,
    selectedCity,
  } = useSelector((state) => state.order);

  const citiesOfAzerbaijan = [
    'Baku',
    'Ganja',
    'Sumqayit',
    'Mingachevir',
    'Shirvan',
    'Lankaran',
    'Nakhchivan',
    'Sheki',
    'Yevlakh',
    'Khachmaz',
  ];

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(''));
    dispatch(setSuccessMessage(''));

    if (cartItems.length === 0) {
      dispatch(setError('No items in the cart.'));
      return;
    }

    if (cardCVV.length !== 3) {
      dispatch(setError('CVV must be exactly 3 digits.'));
      return;
    }

    try {
      const selectedCountry = deliveryCountry === 'International' ? specificCountry : deliveryCountry;

      if (deliveryCountry === 'International' && !specificCountry) {
        dispatch(setError('Please select a specific country for international delivery.'));
        return;
      }

      if (deliveryCountry === 'Azerbaijan' && !selectedCity) {
        dispatch(setError('Please select a city for delivery in Azerbaijan.'));
        return;
      }

      const response = await axios.post(
          'https://localhost:7131/api/order/create',
          {
            userId,
            orderItems: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: {
              country: selectedCountry,
              city: selectedCity,
              firstName,
              lastName,
              address,
              zipCode,
              phoneNumber,
            },
            paymentDetails: {
              cardNumber,
              cardExpiry,
              cardCVV,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true
          }
      );

      dispatch(setOrderDetails(response.data));
      dispatch(setSuccessMessage('Order created and payment processed successfully!'));

      const deliveryTimes = {
        Azerbaijan: '1 week',
        USA: '2 weeks',
        Canada: '3 weeks',
        UK: '1 week',
        Germany: '2 weeks',
        France: '2 weeks',
        Italy: '2 weeks',
        Spain: '3 weeks',
        China: '4 weeks',
        India: '4 weeks',
        Australia: '5 weeks',
      };

      const estimatedTime = deliveryTimes[selectedCountry] || 'Unknown delivery time';
      dispatch(setDeliveryTime(estimatedTime));

      navigate(`/order-confirmation/${response.data.id}`);
    } catch (error) {
      const errorMessage = error.response?.data || 'Error processing your order. Please try again.';
      dispatch(setError(errorMessage));
    }
  };

  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'China', 'India', 'Australia'];

  return (
      <div className="container mx-auto p-6 max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Place Your Order</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {orderDetails && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-2">Order Details</h2>
              <p><strong>Order ID:</strong> {orderDetails.id}</p>
              <p><strong>Estimated Delivery Time:</strong> {deliveryTime}</p>
              <h3 className="mt-4 text-lg font-semibold">Items:</h3>
              {orderDetails.orderItems && orderDetails.orderItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {orderDetails.orderItems.map((item) => (
                        <div key={item.productId} className="flex items-center space-x-4">
                          <img
                              src={item.productImage || '/placeholder.png'}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-gray-700">{item.productName}</p>
                            <p className="text-gray-500">Price: ${item.price}</p>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <p>No items found in the order.</p>
              )}
            </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Delivery Country</label>
            <select
                value={deliveryCountry}
                onChange={(e) => dispatch(setDeliveryCountry(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="International">International</option>
            </select>
          </div>

          {deliveryCountry === 'Azerbaijan' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Select City</label>
                <select
                    value={selectedCity}
                    onChange={(e) => dispatch(setSelectedCity(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
          )}

          {deliveryCountry === 'International' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Select Country</label>
                <select
                    value={specificCountry}
                    onChange={(e) => dispatch(setSpecificCountry(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                >
                  <option value="">Select a country...</option>
                  {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                  ))}
                </select>
              </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">First Name</label>
              <input
                  type="text"
                  value={firstName}
                  onChange={(e) => dispatch(setFirstName(e.target.value))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Last Name</label>
              <input
                  type="text"
                  value={lastName}
                  onChange={(e) => dispatch(setLastName(e.target.value))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <input
                type="text"
                value={address}
                onChange={(e) => dispatch(setAddress(e.target.value))}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Zip Code</label>
              <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => dispatch(setZipCode(e.target.value))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Card Number</label>
              <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => dispatch(setCardNumber(e.target.value))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Card Expiry</label>
              <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => dispatch(setCardExpiry(e.target.value))}
                  required
                  placeholder="MM/YY"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Card CVV</label>
            <input
                type="text"
                value={cardCVV}
                onChange={(e) => dispatch(setCardCVV(e.target.value))}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                maxLength="3"
            />
          </div>

          <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
          >
            Place Order
          </button>
        </form>
      </div>
  );
};

export default Order;