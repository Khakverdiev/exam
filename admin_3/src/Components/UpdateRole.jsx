import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";

const UpdateRole = () => {
    const { accessToken, refreshAccessToken } = useAuth();
    const [roles, setRoles] = useState([]);
    const [email, setEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [action, setAction] = useState("grant");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoles = async () => {
            setError("");
            setMessage("");
            try {
                let token = accessToken;
                if (!token || isTokenExpired(token)) {
                    token = await refreshAccessToken();
                }

                const response = await axios.get("https://localhost:7059/api/role/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                // Извлекаем роли из `$values`
                const rolesData = response.data.$values || [];
                setRoles(rolesData);
            } catch (error) {
                setError("Ошибка при загрузке ролей.");
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();
    }, [accessToken, refreshAccessToken]);

    const isTokenExpired = (token) => {
        if (!token) return true;
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        return tokenData.exp * 1000 < Date.now();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            let token = accessToken;
            if (!token || isTokenExpired(token)) {
                token = await refreshAccessToken();
            }

            const endpoint = action === "grant" 
                ? "https://localhost:7059/api/role/grant" 
                : "https://localhost:7059/api/role/revoke";

            await axios.post(
                endpoint,
                {
                    email,
                    roleName: selectedRole,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            setMessage(
                action === "grant"
                    ? "Роль успешно добавлена."
                    : "Роль успешно удалена."
            );
        } catch (error) {
            setError(
                action === "grant"
                    ? "Ошибка при добавлении роли."
                    : "Ошибка при удалении роли."
            );
            console.error("Error updating role:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Управление Ролями Пользователей
                </h2>

                {message && (
                    <p className="text-green-500 text-center mb-4">{message}</p>
                )}
                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Email пользователя
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Введите email пользователя"
                            className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Выберите роль
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            required
                            className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Выберите роль</option>
                            {roles.map((role) => (
                                <option key={role.$id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Выберите действие
                        </label>
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            required
                            className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="grant">Добавить роль</option>
                            <option value="revoke">Удалить роль</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Обновить Роль
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateRole;
