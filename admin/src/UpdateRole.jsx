import React, { useState } from "react";
import axios from "axios";
import {useAuth} from "./AuthContext";

const UpdateRole = () => {
    const { auth, refreshAccessToken } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [role, setRole] = useState("appuser");
    const [error, setError] = useState(null);

    const handleSearchUser = async () => {
        if (searchQuery) {
            try {
                await refreshAccessToken();
                const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(searchQuery);
                const endpoint = isUuid
                    ? `https://localhost:7131/api/UserProfile/${searchQuery}`
                    : `https://localhost:7131/api/UserProfile/username/${searchQuery}`;

                const response = await axios.get(endpoint, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${auth?.accessToken}`,
                    },
                });
                setUserProfile(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Пользователь не найден или произошла ошибка.");
            }
        }
    };

    const handleRoleUpdate = async () => {
        try {
            await refreshAccessToken();
            const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(searchQuery);
            const updateEndpoint = isUuid
                ? `https://localhost:7131/api/admin/user/${userProfile.userId}/role`
                : `https://localhost:7131/api/admin/user/username/${searchQuery}/role`;

            await axios.put(updateEndpoint, role, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${auth?.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            alert("Роль пользователя успешно обновлена.");
        } catch (err) {
            console.error(err);
            setError("Произошла ошибка при обновлении роли.");
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Обновление Роли Пользователя</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите ID пользователя или имя"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button
                        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleSearchUser}
                    >
                        Найти пользователя
                    </button>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {userProfile && (
                    <div className="mt-6 border p-4 rounded-lg bg-gray-50">
                        <h2 className="text-lg font-semibold mb-4 text-center">Информация о пользователе</h2>
                        <p><strong>Имя:</strong> {userProfile.firstName || "Не указано"}</p>
                        <p><strong>Фамилия:</strong> {userProfile.lastName || "Не указано"}</p>
                        <p><strong>Город:</strong> {userProfile.city || "Не указано"}</p>
                        <p><strong>Страна:</strong> {userProfile.country || "Не указано"}</p>
                        <div className="mt-4">
                            <label className="block mb-2">Новая роль:</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="appuser">appuser</option>
                                <option value="appadmin">appadmin</option>
                            </select>
                            <button
                                className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                onClick={handleRoleUpdate}
                            >
                                Обновить роль
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateRole;