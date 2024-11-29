import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const { accessToken, refreshAccessToken, username } = useAuth();
  const { addItemToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [cachedProducts, setCachedProducts] = useState(null);
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const categories = ["Все категории", "Hoodie", "Shirt", "Pants", "Jacket", "Accessories", "Shoes"];
  const productsPerPage = 6;

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.exp * 1000 < Date.now();
  };

  const fetchProducts = async () => {
    setError("");
    setLoading(true);
  
    try {

      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }
  
      const response = await axios.get("https://localhost:7193/api/userproduct/all", {
        withCredentials: true,
      });
  
      const transformedProducts = (response.data.$values || response.data).map((product) => ({
        ...product,
        sizes: product.sizes?.$values
          ? product.sizes.$values[0].split(", ").map((size) => size.trim())
          : [],
      }));
      setProducts(transformedProducts);
      setCachedProducts(transformedProducts);
    } catch (error) {
      setError("Ошибка получения продуктов. Пожалуйста, попробуйте снова.");
      console.error("Ошибка получения продуктов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuy = (productId) => {

    if (!username) {
      navigate("/login");
      return;
    }

    const quantity = quantities[productId] || 1;
    const size = selectedSizes[productId];
    const product = products.find((prod) => prod.id === productId);

    if (!size) {
      setModalMessage("Пожалуйста, выберите размер.");
      setModalVisible(true);
      return;
    }

    if (quantity <= 0) {
      setModalMessage("Количество должно быть больше нуля.");
      setModalVisible(true);
      return;
    }

    if (product && quantity > product.quantity) {
      setModalMessage(`Вы можете купить до ${product.quantity} единиц этого товара.`);
      setModalVisible(true);
      return;
    }

    addItemToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      size,
      username,
    });

    setModalMessage("");
    setModalVisible(false);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Все категории" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-gray-100">
      <div className="flex-grow px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          Welcome to Our Store
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 w-full max-w-md border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 w-full max-w-md border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-700 bg-gray-800 rounded-lg p-6 shadow-lg transform transition duration-300 hover:scale-105"
              >
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-400 mb-2">Price: ${product.price}</p>
                <p className="text-gray-400 mb-4">In stock: {product.quantity}</p>
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
                <div className="mt-4">
                  <select
                    onChange={(e) => setSelectedSizes((prev) => ({ ...prev, [product.id]: e.target.value }))}
                    value={selectedSizes[product.id] || ""}
                    className="p-2 border border-gray-700 bg-gray-800 rounded w-full text-white"
                  >
                    <option value="">Select size</option>
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => setQuantities((prev) => ({ ...prev, [product.id]: +e.target.value }))}
                  className="mt-2 w-full p-2 border border-gray-700 bg-gray-800 rounded text-white"
                />
                <button
                  onClick={() => handleBuy(product.id)}
                  className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No products available.</p>
        )}

        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-md text-center">
            <p>{modalMessage}</p>
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;