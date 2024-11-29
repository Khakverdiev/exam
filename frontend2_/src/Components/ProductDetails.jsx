import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { accessToken, refreshAccessToken, username } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    setError('');

    try {
      let token = accessToken;
      if (isTokenExpired(token)) {
        token = await refreshAccessToken();
      }

      const response = await axios.get(`https://localhost:7193/api/userproduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details: ', error);
      setError('Product not found.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const response = await axios.get(`https://localhost:7193/api/reviews/product/${id}`);
      setReviews(response.data?.$values || response.data || []);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let token = accessToken;
      if (isTokenExpired(token)) {
        token = await refreshAccessToken();
      }

      const reviewData = {
        username,
        productId: id,
        reviewText: reviewText.trim(),
        rating,
      };

      await axios.post(
        'https://localhost:7193/api/reviews',
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setReviewText('');
      setRating(1);
      fetchProductReviews(); 
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Пожалуйста, подтвердите свою электронную почту, чтобы оставить отзыв.');
      } else {
        console.error('Error submitting review:', error);
        setError('Ошибка при отправке отзыва. Попробуйте снова.');
      }
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews(); 
  }, [id, accessToken]);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.exp * 1000 < Date.now();
  };

  if (loading) return <p>Loading product details...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <>
    <br></br>
    <br></br>
    <br></br>
      <div className="flex flex-col items-center justify-center min-h-screen mt-15 px-20 sm:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="max-w-4xl mx-auto bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-4xl font-extrabold mb-6 text-center">{product.name}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full sm:w-2/5 h-auto rounded-lg shadow-md mb-4 sm:mb-0 hover:scale-105 transition-transform duration-300"
            />
            <div className="sm:ml-8 text-lg w-full sm:w-3/5">
              <p className="mb-4">
                <span className="font-semibold">Description:</span> {product.description}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Price:</span> ${product.price}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Available:</span> {product.quantity}
              </p>
            </div>
          </div>
  
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold shadow-lg hover:bg-purple-700 transition duration-300"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
  
        <div className="mt-12 max-w-4xl w-full">
          <h3 className="text-3xl font-bold mb-6 text-center">Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-700 p-4 rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-bold text-white">{review.username}</p>
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      {review.rating} / 5
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 text-sm">{review.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
