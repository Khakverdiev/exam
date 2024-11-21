import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";

const Product = () => {
    const { accessToken } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        category: "",
        imageFile: null,
        imageUrl: "",
        sizes: [],
    });
    const [editProduct, setEditProduct] = useState(null);
    const [sizeInput, setSizeInput] = useState("");

    const categoryMapping = {
        Hoodie: 0,
        Shirt: 1,
        Pants: 2,
        Jacket: 3,
        Accessories: 4,
        Shoes: 5,
    };

    const reverseCategoryMapping = Object.fromEntries(
        Object.entries(categoryMapping).map(([key, value]) => [value, key])
    );

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://localhost:7193/api/admin/products", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const productsData = response.data.$values || response.data;

            const transformedProducts = productsData.map((product) => ({
                ...product,
                category: reverseCategoryMapping[product.category] || "Unknown",
                sizes: product.sizes?.$values
                    ? product.sizes.$values[0]?.split(",").map((size) => size.trim())
                    : []
            }));

            setProducts(transformedProducts);
        } catch (err) {
            setError("Ошибка при загрузке продуктов.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editProduct) {
            setEditProduct({ ...editProduct, [name]: value });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (editProduct) {
            setEditProduct({ ...editProduct, imageFile: file });
        } else {
            setNewProduct({ ...newProduct, imageFile: file });
        }
    };

    const handleAddSize = () => {
        const target = editProduct || newProduct;
        if (sizeInput.trim() && !target.sizes.includes(sizeInput.trim())) {
            const updatedSizes = [...target.sizes, sizeInput.trim()];
            if (editProduct) {
                setEditProduct({ ...editProduct, sizes: updatedSizes });
            } else {
                setNewProduct({ ...newProduct, sizes: updatedSizes });
            }
            setSizeInput("");
        }
    };

    const handleRemoveSize = (size) => {
        const target = editProduct || newProduct;
        const updatedSizes = target.sizes.filter((s) => s !== size);
        if (editProduct) {
            setEditProduct({ ...editProduct, sizes: updatedSizes });
        } else {
            setNewProduct({ ...newProduct, sizes: updatedSizes });
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("description", newProduct.description);
        formData.append("price", newProduct.price);
        formData.append("quantity", newProduct.quantity);
        formData.append("category", categoryMapping[newProduct.category] || 0);
        if (newProduct.imageFile) {
            formData.append("imageFile", newProduct.imageFile);
        }
        newProduct.sizes.forEach((size) => {
            formData.append("sizes", size);
        });

        try {
            await axios.post("https://localhost:7193/api/admin/products", formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });
            fetchProducts();
            setNewProduct({
                name: "",
                description: "",
                price: 0,
                quantity: 0,
                category: "",
                imageFile: null,
                imageUrl: "",
                sizes: [],
            });
        } catch (err) {
            setError("Ошибка при добавлении продукта.");
            console.error(err);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const updatedProduct = {
                name: editProduct.name,
                description: editProduct.description,
                price: editProduct.price,
                quantity: editProduct.quantity,
                category: categoryMapping[editProduct.category] || 0,
                sizes: editProduct.sizes.map((size) => size.trim()),
                imageUrl: editProduct.imageUrl,
            };

            const response = await axios.put(
                `https://localhost:7193/api/admin/products/${editProduct.id}`,
                updatedProduct,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Продукт обновлен:", response.data);
            fetchProducts();
            setEditProduct(null);
            setError("");
        } catch (err) {
            if (err.response) {
                console.error("Ошибка обновления:", err.response.data.errors);
                setError(
                    "Ошибка при обновлении продукта: " +
                    JSON.stringify(err.response.data.errors)
                );
            } else {
                console.error("Ошибка:", err.message);
                setError("Ошибка соединения с сервером.");
            }
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct({
            ...product,
            sizes: product.sizes || [],
        });
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`https://localhost:7193/api/admin/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            fetchProducts();
        } catch (err) {
            setError("Ошибка при удалении продукта.");
            console.error(err);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Product Management</h1>
            
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
                {editProduct ? "Edit Product" : "Add a new product"}
            </h2>
            
            <form
                onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}
                className="space-y-4 bg-white p-6 shadow rounded-md mt-6 max-w-md mx-auto"
            >
                <label htmlFor="name" className="block text-gray-700 font-semibold">Название</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={editProduct ? editProduct.name : newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Название"
                    className="border border-gray-300 p-2 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
    
                <label htmlFor="description" className="block text-gray-700 font-semibold">Описание</label>
                <textarea
                    id="description"
                    name="description"
                    value={editProduct ? editProduct.description : newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Описание"
                    className="border border-gray-300 p-2 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
    
                <label htmlFor="price" className="block text-gray-700 font-semibold">Цена</label>
                <input
                    id="price"
                    type="number"
                    name="price"
                    value={editProduct ? editProduct.price : newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Цена"
                    className="border border-gray-300 p-2 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
    
                <label htmlFor="quantity" className="block text-gray-700 font-semibold">Количество</label>
                <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={editProduct ? editProduct.quantity : newProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Количество"
                    className="border border-gray-300 p-2 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
    
                <label htmlFor="category" className="block text-gray-700 font-semibold">Категория</label>
                <select
                    id="category"
                    name="category"
                    value={editProduct ? editProduct.category : newProduct.category}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                    <option value="Hoodie">Hoodie</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pants">Pants</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                </select>
    
                <label htmlFor="sizeInput" className="block text-gray-700 font-semibold">Добавить размер</label>
                <div className="flex items-center">
                    <input
                        id="sizeInput"
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        placeholder="Размер (например, S, M, L)"
                        className="border border-gray-300 p-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200 flex-grow"
                    />
                    <button
                        type="button"
                        onClick={handleAddSize}
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Add Size
                    </button>
                </div>
                <div className="flex flex-wrap mt-2">
                    {(editProduct ? editProduct.sizes : newProduct.sizes).map((size) => (
                        <span
                            key={size}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mb-2"
                        >
                            {size}
                            <button
                                type="button"
                                onClick={() => handleRemoveSize(size)}
                                className="ml-1 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
    
                <label htmlFor="imageFile" className="block text-gray-700 font-semibold">Загрузить изображение</label>
                <input
                    id="imageFile"
                    type="file"
                    name="imageFile"
                    onChange={handleFileChange}
                    className="border border-gray-300 p-2 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
    
                <label htmlFor="imageUrl" className="block text-gray-700 font-semibold">Ссылка на изображение (только для update)</label>
                <input
                    id="imageUrl"
                    type="text"
                    name="imageUrl"
                    value={editProduct ? editProduct.imageUrl : newProduct.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Ссылка на изображение"
                    className="border border-gray-300 p-2 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
    
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring focus:ring-blue-300"
                >
                    {editProduct ? "Update Product" : "Add a Product"}
                </button>
            </form>
    
            <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-700 text-center">Products List</h2>
            {loading ? (
                <p className="text-center text-gray-600">Loading products...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                            {product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded-md mb-4"
                                />
                            )}
                            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                            <p className="text-gray-500 mb-2">{product.id}</p>
                            <p className="text-gray-500 mb-2">{product.category}</p>
                            <p className="text-gray-600 mb-2">{product.description}</p>
                            <p className="text-blue-600 font-semibold mb-2">${product.price}</p>
                            <p className="text-gray-600 mb-4">Количество: {product.quantity}</p>
                            <p className="text-gray-600 mb-4">
                                Размеры: {product.sizes?.join(", ") || "Нет доступных размеров"}
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditProduct(product)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );      
};

export default Product;