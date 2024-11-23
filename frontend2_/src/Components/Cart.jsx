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
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Your Cart</h1>

      {cartItems.length > 0 && (
        <>
          <button
            onClick={handleBuy}
            className="bg-black text-white py-1 px-2 rounded hover:bg-green-700 mb-4 sm:mb-6 mx-auto block w-full sm:w-auto"
          >
            Buy
          </button>
          <p className="text-right font-bold text-lg">Total Price: ${totalPrice.toFixed(2)}</p>
        </>
      )}

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="border p-4 rounded shadow">
              <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
              <p>Price: ${item.price}</p>
              <div className="flex items-center gap-2">
                <p>Quantity:</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.productId, item.size, Number(e.target.value))
                  }
                  className="w-16 p-1 border rounded text-center"
                />
              </div>
              <p>Size: {item.size}</p>
              <div className="flex justify-center items-center h-40 sm:h-48 mb-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button
                onClick={() => handleRemoveItem(item.productId, item.size)}
                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow">
                <h3 className="text-lg sm:text-xl font-semibold">{product.name}</h3>
                <p>Price: ${product.price}</p>
                <div className="flex justify-center items-center h-40 sm:h-48 mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <button
                  onClick={() => handleAddRecommendationToCart(product)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;