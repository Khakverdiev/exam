import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ShowReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { accessToken, refreshAccessToken } = useAuth();

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.exp * 1000 < Date.now();
    };

    const fetchReviews = async () => {
        setLoading(true);
        setError('');

        try {
            let token = accessToken;

            if (isTokenExpired(accessToken)) {
                console.log('AccessToken истек, обновляем...');
                token = await refreshAccessToken();
                if (!token) {
                    setError('Не удалось обновить токен. Пожалуйста, выполните повторный вход.');
                    setLoading(false);
                    return;
                }
            }

            const response = await axios.get('https://localhost:7131/api/review', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const reviewsData = response.data.$values || response.data;
            setReviews(reviewsData);

        } catch (error) {
            setError('Ошибка получения отзывов. Пожалуйста, попробуйте снова.');
            console.error('Ошибка получения отзывов:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    if (loading) return <p>Загрузка отзывов...</p>;

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="reviews-container mt-8 p-4 pt-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Отзывы покупателей</h2>
            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="review-item border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white"
                        >
                            <div className="flex items-center justify-center p-4">
                                <img
                                    src={review.productImageUrl || 'https://via.placeholder.com/150'}
                                    alt={review.productName}
                                    className="w-40 h-40 object-cover rounded mb-4"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{review.productName}</h3>
                                <p className="text-gray-700 mb-2">{review.reviewText}</p>
                                <span className="text-yellow-500">Рейтинг: {review.rating}/5</span>
                                <p className="text-sm text-gray-500 mt-2">
                                    Дата: {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">Автор: {review.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Пока нет отзывов.</p>
            )}
        </div>
    );
}

export default ShowReviews;