import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../AuthContext";

const ConfirmEmail = () => {
    const { handleLogin, accessToken } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [confirmEmailSuccess, setConfirmEmailSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            if (!accessToken) return;

            try {
                const response = await axios.post(
                    'https://localhost:7131/api/account/ConfirmEmail',
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        withCredentials: true,
                    }
                );

                const { accessToken: newAccessToken, refreshToken, userId, username, refreshTokenExpireTime, role } = response.data;

                handleLogin(userId, username, newAccessToken, refreshToken, refreshTokenExpireTime, role);

                setMessage('Ваш email был успешно подтвержден! Вы вошли в систему.');
                setError('');
                setConfirmEmailSuccess(true);

                setTimeout(() => {
                    navigate('/home');
                }, 3000);
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data === "Email already confirmed.") {
                    setMessage('Email уже был подтвержден. Переход на главную...');
                    setError('');
                    setConfirmEmailSuccess(true);

                    setTimeout(() => {
                        navigate('/home');
                    }, 3000);
                } else {
                    console.error('Ошибка при подтверждении email:', err);
                    setError('Произошла ошибка при подтверждении вашего email. Пожалуйста, попробуйте позже.');
                    setMessage('');
                }
            }
        };

        confirmEmail();
    }, [accessToken, navigate, handleLogin]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-6 text-center">Подтверждение Email</h1>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
                <p className="text-gray-600 text-sm text-center">Пожалуйста, подождите, пока мы подтверждаем ваш email.</p>
            </div>
        </div>
    );
};

export default ConfirmEmail;