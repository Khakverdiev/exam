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
    <div className="flex flex-col min-h-screen pt-16">
      <div className="flex-grow px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-6">Home</h1>
        <div className="flex flex-col md:flex-row justify-center mb-6">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 ml-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
          <p className="text-center text-red-500">{error}</p>
        ) : Array.isArray(displayedProducts) && displayedProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="text-lg md:text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-700 mb-4">Price: ${product.price}</p>
                  <p className="text-gray-700 mb-4">In stock: {product.quantity}</p>
                  <div
                    className="p-4 h-48 md:h-64 flex items-center justify-center cursor-pointer bg-gray-100 rounded mb-4 transition-transform duration-300 hover:scale-105"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <select
                      onChange={(e) => handleSizeChange(product.id, e.target.value)}
                      value={selectedSizes[product.id] || ""}
                      className="p-2 border border-gray-300 rounded w-full mb-2"
                    >
                      <option value="">Выберите размер</option>
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
                    defaultValue={1}
                    onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => handleBuy(product.id)}
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center">Нет доступных товаров.</p>
        )}
      </div>
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-center">
            <p className="text-red-600 font-bold mb-4">{modalMessage}</p>
            <button
              onClick={() => setModalVisible(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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