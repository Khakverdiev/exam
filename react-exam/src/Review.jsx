import {getReviewsByProduct, createReview, deleteReview} from './ReviewService';
import { useAuth } from "./AuthContext";
import { useState } from 'react';

const Review = ({ productId, token }) => {
    const [reviews, setReviews] = useState([]);
    const { accessToken, userId } = useAuth();
    const [newReview, setNewReview] = useState({
        userId: userId,
        productId: productId,
        reviewText: '',
        rating: 0,
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const fetchedReviews = await getReviewsByProduct(productId, token);
                setReviews(fetchedReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [productId, token]);

    const handleCreateReview = async () => {
        try {
            const review = await createReview(newReview, token);
            setReviews([...reviews, review]);
        } catch (error) {
            console.error('Error creating review:', error);
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            await deleteReview(id, token);
            setReviews(reviews.filter(review => review.id !== id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div>
            <h2>Отзывы</h2>
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        {review.reviewText} - {review.rating} stars
                        <button onClick={() => handleDeleteReview(review.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
            <div>
                <h3>Leave feedback</h3>
                <h3>Оставить отзыв</h3>
                <textarea
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                    placeholder="Введите отзыв"
                />
                <input
                    type="number"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    placeholder="Рейтинг"
                    max="5"
                    min="1"
                />
                <button onClick={handleCreateReview}>Отправить</button>
            </div>
        </div>
    );
};

export default Review;
