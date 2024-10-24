import React, { useState, useEffect } from "react";
import axios from "axios";
import {useAuth} from "./AuthContext";
import { useForm } from "react-hook-form";

const Products = () => {
    const { accessToken, refreshAccessToken } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { register, handleSubmit, reset } = useForm();

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const token = accessToken;
            const response = await axios.get("https://localhost:7131/api/admin/products", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const productsData = response.data.$values ? response.data.$values : response.data;
            setProducts(productsData);
        } catch (error) {
            setError("Ошибка при загрузке продуктов.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [accessToken]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("Name", data.name);
            formData.append("Description", data.description);
            formData.append("Price", data.price);
            formData.append("Quantity", data.quantity);
            formData.append("Category", data.category);
            formData.append("ImageFile", data.image[0]);

            const token = accessToken;
            await axios.post("https://localhost:7131/api/admin/product", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            fetchProducts();
            reset();
        } catch (error) {
            if (error.response) {
                // Сервер ответил с ошибкой
                console.error("Ошибка ответа сервера:", error.response.data);
            } else if (error.request) {
                // Запрос был отправлен, но ответа нет
                console.error("Нет ответа от сервера:", error.request);
            } else {
                // Ошибка настройки запроса
                console.error("Ошибка при настройке запроса:", error.message);
            }
            setError("Ошибка при добавлении продукта.");
        }
    };

    const deleteProduct = async (id) => {
        try {
            const token = accessToken;
            await axios.delete(`https://localhost:7131/api/admin/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            fetchProducts();
        } catch (error) {
            setError("Ошибка при удалении продукта.");
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto p-4 pt-20">
            <h1 className="text-4xl font-bold mb-6 text-center">Products</h1>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"> {/* Увеличил отступы и изменил стиль */}
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border p-6 rounded-lg shadow-lg flex flex-col justify-between bg-white hover:shadow-xl transition-shadow duration-300"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                    <p className="text-gray-700 mb-2">Price: ${product.price}</p>
                                    <p className="text-gray-700 mb-2">Quantity: {product.quantity}</p>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-48 object-contain mt-2"
                                    />
                                </div>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="bg-red-500 text-white mt-4 py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-center">Add New Product</h2> {/* Центрирование заголовка */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto"> {/* Ограничил ширину формы */}
                        <input
                            {...register("name", { required: true })}
                            type="text"
                            placeholder="Name"
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            {...register("description", { required: true })}
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            {...register("price", { required: true })}
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            {...register("quantity", { required: true })}
                            type="number"
                            placeholder="Quantity"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            {...register("category", { required: true })}
                            type="text"
                            placeholder="Category"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            {...register("image", { required: true })}
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                        >
                            Add Product
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Products;