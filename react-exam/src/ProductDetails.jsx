import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { accessToken, refreshAccessToken, userId } = useAuth();
  const [product, setProduct] = useState(null);
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

      const response = await axios.get(`https://localhost:7131/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details: ', error);
      setError('Product not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      let token = accessToken;
      if (isTokenExpired(token)) {
        token = await refreshAccessToken();
      }

      const response = await axios.post(
        'https://localhost:7131/api/review',
        {
          userId,
          productId: id,
          reviewText,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      console.log('Review submitted:', response.data);
      setReviewText('');
      setRating(1);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Error submitting review.');
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id, accessToken]);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return tokenData.exp * 1000 < Date.now();
  };

  if (loading) return <p>Loading product details...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg mx-auto p-4 border rounded shadow bg-white">
        <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
        <p className="text-lg mb-2">Description: {product.description}</p>
        <p className="text-lg mb-2">Price: ${product.price}</p>
        <p className="text-lg mb-2">Available: {product.quantity}</p>
        <div className="flex items-center justify-center mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-full h-auto"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-2">Leave a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-lg">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-lg">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
            >
              Submit Review
            </button>
          </form>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 bg-black text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;