import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from './AuthContext';

const MyReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { accessToken, userId, refreshAccessToken } = useAuth();
    const [editingReview, setEditingReview] = useState(null);
    const [updatedReviewText, setUpdatedReviewText] = useState('');
    const [updatedRating, setUpdatedRating] = useState(1);

    const fetchMyReviews = async () => {
        setLoading(true);
        setError('');

        try {
            let token = accessToken;
            if (!token) {
                token = await refreshAccessToken();
                if (!token) {
                    setError('Не удалось обновить токен. Пожалуйста, войдите снова.');
                    setLoading(false);
                    return;
                }
            }

            const response = await axios.get(`https://localhost:7131/api/review/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const reviewsData = response.data.$values || response.data;
            setReviews(reviewsData);
        } catch (err) {
            setError('Ошибка получения отзывов. Пожалуйста, попробуйте снова.');
            console.error('Ошибка получения отзывов:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            const token = accessToken || (await refreshAccessToken());
            await axios.delete(`https://localhost:7131/api/review/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setReviews(reviews.filter((review) => review.id !== reviewId));
        } catch (err) {
            console.error('Ошибка удаления отзыва:', err);
            setError('Ошибка удаления отзыва. Пожалуйста, попробуйте снова.');
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setUpdatedReviewText(review.reviewText);
        setUpdatedRating(review.rating);
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setUpdatedReviewText('');
        setUpdatedRating(1);
    };

    const handleSaveEdit = async () => {
        try {
            const token = accessToken || (await refreshAccessToken());
            const updatedReview = {
                id: editingReview.id,
                reviewText: updatedReviewText,
                rating: updatedRating,
            };

            await axios.put(`https://localhost:7131/api/review/${editingReview.id}`, updatedReview, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            setReviews(
                reviews.map((review) =>
                    review.id === editingReview.id ? { ...review, reviewText: updatedReviewText, rating: updatedRating } : review
                )
            );
            handleCancelEdit();
        } catch (err) {
            console.error('Ошибка обновления отзыва:', err);
            setError('Ошибка обновления отзыва. Пожалуйста, попробуйте снова.');
        }
    };

    useEffect(() => {
        fetchMyReviews();
    }, [accessToken]);

    if (loading) return <p>Загрузка отзывов...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="my-reviews-container mt-24 p-6 max-w-5xl mx-auto bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-8 text-center">Мои отзывы</h2>
            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white flex flex-col">
                            <h3 className="text-xl font-semibold mb-2">{review.productName || 'Продукт'}</h3>
                            <div className="flex justify-center mb-4">
                                <img
                                    src={review.productImageUrl || 'https://via.placeholder.com/150'}
                                    alt={review.productName}
                                    className="w-full h-40 object-contain rounded"
                                />
                            </div>
                            {editingReview?.id === review.id ? (
                                <div>
                                    <textarea
                                        value={updatedReviewText}
                                        onChange={(e) => setUpdatedReviewText(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded mb-4"
                                    />
                                    <select
                                        value={updatedRating}
                                        onChange={(e) => setUpdatedRating(Number(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded mb-4"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                                        >
                                            Отменить
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-between flex-grow">
                                    <p className="text-gray-700 mb-4">{review.reviewText}</p>
                                    <p className="text-yellow-500 mb-4">Рейтинг: {review.rating}/5</p>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleEdit(review)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg text-gray-500">У вас пока нет отзывов.</p>
            )}
        </div>
    );
}

export default MyReview;