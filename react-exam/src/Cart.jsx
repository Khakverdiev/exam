import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import axios from "axios";

const Cart = () => {
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const { accessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("https://localhost:7131/api/product/GetProducts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true
      });

      setProducts(response.data.$values || []);
    } catch (error) {
      setError("Error fetching products. Please try again.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProducts();
    }
  }, [accessToken]);

  const handleBuy = () => {
    console.log("Proceeding to buy items in the cart");
    clearCart();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Your Cart</h1>

      {cartItems.length > 0 && (
        <button
          onClick={handleBuy}
          className="bg-black text-white py-1 px-2 rounded hover:bg-green-700 mb-4 sm:mb-6 mx-auto block w-full sm:w-auto"
        >
          Buy
        </button>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item, index) => {
            const product = products.find((prod) => prod.id === item.productId);

            if (!product) {
              return (
                <div key={item.productId || index} className="border p-4 rounded shadow">
                  <h2 className="text-lg sm:text-xl font-semibold">Product not found</h2>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className="text-red-500">Image not available</p>
                  <button
                    onClick={() => removeItemFromCart(item.productId)}
                    className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            return (
              <div key={item.productId || index} className="border p-4 rounded shadow">
                <h2 className="text-lg sm:text-xl font-semibold">{product.name}</h2>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="flex justify-center items-center h-40 sm:h-48 mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <button
                  onClick={() => removeItemFromCart(item.productId)}
                  className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;