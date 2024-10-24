import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItemFromCart,
  clearCart,
  setLoading,
  setError,
  setCartItems,
} from "./features/cart/cartSlice";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import {useNavigate} from "react-router-dom";

const Cart = () => {
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handleRemoveItem = (productId) => {
    removeItemFromCart(productId);
  };

  const handleBuy = () => {
    if (cartItems.length > 0) {
      navigate("/order", {state: {cartItems} });
    } else {
      console.log("Your cart is empty. Add items to proceed.");
    }
  };

  return (
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          Your Cart
        </h1>

        {cartItems.length > 0 && (
            <button
                onClick={handleBuy}
                className="bg-black text-white py-1 px-2 rounded hover:bg-green-700 mb-4 sm:mb-6 mx-auto block w-full sm:w-auto"
            >
              Buy
            </button>
        )}

        {cartItems.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartItems.map((item) => (
                  <div
                      key={item.productId}
                      className="border p-4 rounded shadow"
                  >
                    <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <div className="flex justify-center items-center h-40 sm:h-48 mb-4">
                      <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default Cart;