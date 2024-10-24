import React, { useEffect, useState } from "react";
import axios from "axios";
import Rating from "./Rating";
import { useAuth } from "./AuthContext";

const ProductReviews = ({ productId }) => {
    const { accessToken, refreshAccessToken } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!accessToken) {
                    await refreshAccessToken();
                }

                const response = await axios.get(`https://localhost:7131/api/admin/reviews`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                });
                const reviewData = response.data.$values || [];
                setReviews(reviewData);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError("Пожалуйста, войдите в систему, чтобы просматривать отзывы.");
                } else {
                    setError("Ошибка при загрузке отзывов.");
                }
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, accessToken, refreshAccessToken]);

    if (loading) {
        return <p>Загрузка отзывов...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Отзывы клиентов</h1>
            <Rating reviews={reviews} />
        </div>
    );
};

export default ProductReviews;