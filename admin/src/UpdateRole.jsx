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
                const response = await axios.get(`https://localhost:7131/api/UserProfile/${searchQuery}`, {
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
            await axios.put(`https://localhost:7131/api/admin/user/${userProfile.userId}/role`, role, {
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Обновление Роли Пользователя</h1>
            <div className="mb-4">
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Введите ID пользователя или email"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleSearchUser}
                >
                    Найти пользователя
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {userProfile && (
                <div className="mt-4 border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold">Информация о пользователе</h2>
                    <p><strong>Имя:</strong> {userProfile.firstName || "Не указано"}</p>
                    <p><strong>Фамилия:</strong> {userProfile.lastName || "Не указано"}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Город:</strong> {userProfile.city || "Не указано"}</p>
                    <p><strong>Страна:</strong> {userProfile.country || "Не указано"}</p>
                    <p><strong>Текущая роль:</strong> {userProfile.role}</p>
                    <div className="mt-4">
                        <label className="block mb-2">Новая роль:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border p-2 w-full"
                        >
                            <option value="appuser">appuser</option>
                            <option value="appadmin">appadmin</option>
                        </select>
                        <button
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                            onClick={handleRoleUpdate}
                        >
                            Обновить роль
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateRole;