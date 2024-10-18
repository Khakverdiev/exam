import axios from 'axios';

const API_URL = '/api/v1/review';

export const getReviewsByProduct = async (productId, token) => {
    try {
        const response = await axios.get(`${API_URL}/product/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

export const createReview = async (review, token) => {
    try {
        const response = await axios.post(API_URL, review, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

export const getReviewById = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching review by ID:', error);
        throw error;
    }
};

export const deleteReview = async (id, token) => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};