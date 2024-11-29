import React, { useState, useEffect } from "react";
import { useCart } from "../Contexts/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeItemFromCart, clearCart, totalPrice, addItemToCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7193/api/userproduct/all");
      const products = (response.data.$values || response.data).map((product) => ({
        ...product,
        sizes: product.sizes?.$values
          ? product.sizes.$values[0].split(", ").map((size) => size.trim())
          : [],
      }));
      setAllProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getRecommendations = (cartItems, allProducts) => {
    if (!cartItems.length || !allProducts.length) return [];
    const recommended = new Set();

    cartItems.forEach((cartItem) => {
      allProducts
        .filter((product) => product.id !== cartItem.productId)
        .forEach((item) => recommended.add(item));
    });

    return Array.from(recommended).slice(0, 6);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (cartItems.length && allProducts.length) {
      setRecommendations(getRecommendations(cartItems, allProducts));
    }
  }, [cartItems, allProducts]);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity <= 0) return;
    const itemToUpdate = cartItems.find(
      (item) => item.productId === productId && item.size === size
    );

    if (itemToUpdate) {
      addItemToCart({
        ...itemToUpdate,
        quantity: newQuantity - itemToUpdate.quantity,
      });
    }
  };

  const handleRemoveItem = (productId, size) => {
    removeItemFromCart(productId, size);
  };

  const handleAddRecommendationToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    const quantity = quantities[product.id] || 1;

    if (!selectedSize) {
      alert("Please select a size before adding to the cart.");
      return;
    }

    addItemToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      size: selectedSize,
    });
  };

  const handleBuy = () => {
    if (cartItems.some((item) => !item.productId || !item.quantity || !item.size)) {
      console.error("Cart contains invalid items. Please check your cart.");
      return;
    }

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-10">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>

          {cartItems.length > 0 && (
            <div className="text-center mb-8">
              <button
                onClick={handleBuy}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-lg"
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
                  className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                  <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                  <p className="mb-2">Price: ${item.price}</p>
                  <p className="mb-2">Selected Size: {item.size}</p>
                  <div className="mb-4">
                    <label htmlFor={`quantity-${item.productId}-${item.size}`} className="block mb-2">
                      Quantity:
                    </label>
                    <input
                      id={`quantity-${item.productId}-${item.size}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, item.size, Number(e.target.value))
                      }
                      className="w-full p-2 border border-gray-700 bg-gray-800 rounded text-white"
                    />
                  </div>
                  <div className="flex justify-center items-center h-40 mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId, item.size)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8">Recommended Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                  >
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="mb-2">Price: ${product.price}</p>
                    <div
                      className="p-4 h-64 flex items-center justify-center bg-gray-900 rounded cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <select
                      value={selectedSizes[product.id] || ""}
                      onChange={(e) => handleSizeChange(product.id, e.target.value)}
                      className="p-2 border border-gray-700 bg-gray-800 rounded w-full text-white"
                    >
                      <option value="">Select size</option>
                      {product.sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(product.id, "", Number(e.target.value))
                      }
                      className="mt-2 w-full p-2 border border-gray-700 bg-gray-800 rounded text-white"
                    />
                    <button
                      onClick={() => handleAddRecommendationToCart(product)}
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
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
