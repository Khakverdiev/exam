import React, { useEffect, useState } from "react";
import axios from "axios";
import {useAuth} from "./AuthContext";

const Order = () => {
    const { accessToken } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("https://localhost:7131/api/order/all", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                });

                const ordersData = response.data?.$values || [];
                setOrders(ordersData);
            } catch (err) {
                setError("Ошибка при загрузке заказов.");
                console.error("Ошибка при загрузке заказов:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [accessToken]);

    if (loading) {
        return <p>Загрузка заказов...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Все заказы</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">Заказы не найдены.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border p-4 rounded-lg shadow-md bg-white"
                        >
                            <h2 className="text-xl font-bold mb-2">
                                Заказ #{order.id} — Статус: {order.status}
                            </h2>
                            <p className="text-gray-700 mb-2">
                                Пользователь ID: {order.userId}
                            </p>
                            <p className="text-gray-700 mb-2">
                                Дата: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Товары:</h3>
                                {order.orderItems?.$values.length > 0 ? (
                                    <ul className="space-y-2">
                                        {order.orderItems.$values.map((item) => (
                                            <li key={item.id} className="flex justify-between">
                                                <span>Товар ID: {item.productId} (x{item.quantity})</span>
                                                <span className="text-gray-500">
                                                    Цена: {item.price} $
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Нет товаров в этом заказе.</p>
                                )}
                            </div>
                            <p className="text-gray-700">
                                Адрес доставки: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Order