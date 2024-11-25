import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Contexts/CartContext";
import axios from "axios";

const Cart = () => {
  const { cartItems, removeItemFromCart, clearCart, totalPrice, addItemToCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7193/api/userproduct/all");
      
      const products = response.data?.$values || response.data;
      setAllProducts(products);
      console.log("All products processed:", products);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const getRecommendations = (cartItems, allProducts) => {
    if (!cartItems.length || !allProducts.length) return [];
  
    const recommended = new Set();
  
    cartItems.forEach((cartItem) => {
      allProducts
        .filter(
          (product) =>
            product.category === cartItem.category && product.id !== cartItem.productId
        )
        .forEach((item) => recommended.add(item));
  
      allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(cartItem.name.toLowerCase()) &&
            product.id !== cartItem.productId
        )
        .forEach((item) => recommended.add(item));
  
      allProducts
        .filter(
          (product) =>
            product.price >= cartItem.price * 0.8 &&
            product.price <= cartItem.price * 1.2 &&
            product.id !== cartItem.productId
        )
        .forEach((item) => recommended.add(item));
    });
  
    const finalRecommendations = Array.from(recommended).slice(0, 6);
  
    return finalRecommendations;
  };
  

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (cartItems.length && allProducts.length) {
      const recommendations = getRecommendations(cartItems, allProducts);
      setRecommendations(recommendations);
    }
  }, [cartItems, allProducts]);

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity > 0) {
      const product = cartItems.find(
        (item) => item.productId === productId && item.size === size
      );
      if (product) {
        addItemToCart({ ...product, quantity: newQuantity - product.quantity });
      }
    }
  };

  const handleRemoveItem = (productId, size) => {
    removeItemFromCart(productId, size);
  };

  const handleAddRecommendationToCart = (product) => {
    addItemToCart({ ...product, quantity: 1 });
  };

  const handleBuy = () => {
    if (cartItems.length > 0) {
      navigate("/order", { state: { cartItems } });
    } else {
      console.log("Your cart is empty. Add items to proceed.");
    }
  };

  return (
    <>
    <br></br>
    <br></br>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex flex-col items-center justify-center text-white">
      <div className="container mx-auto py-12 px-4 space-y-8">
      <h1 className="text-4xl font-extrabold text-center">Your Cart</h1>

        {cartItems.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={handleBuy}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
            <p className="mt-4 text-lg font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                <h2 className="text-xl font-bold mb-4">{item.name}</h2>
                <p className="mb-2">Price: ${item.price}</p>
                <p className="mb-2">Size: {item.size}</p>
                <div className="flex items-center gap-2 mb-4">
                  <p>Quantity:</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, item.size, Number(e.target.value))
                    }
                    className="w-16 p-1 border border-gray-600 bg-gray-700 text-white text-center rounded"
                  />
                </div>
                <div className="flex justify-center items-center h-40 mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId, item.size)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-extrabold mb-8">Recommended Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition hover:scale-105"
                >
                  <h3 className="text-xl font-bold mb-4">{product.name}</h3>
                  <p className="mb-2">Price: ${product.price}</p>
                  <div className="flex justify-center items-center h-40 mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                  <button
                    onClick={() => addItemToCart({ ...product, quantity: 1 })}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Cart;