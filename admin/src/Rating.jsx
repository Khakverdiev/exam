import React, { useState } from "react";

const Rating = ({ reviews }) => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Отзывы</h2>
            {reviews.length === 0 ? (
                <p className="text-gray-500 text-center">Отзывов пока нет.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="border p-4 rounded-lg shadow-md bg-white"
                        >
                            <div className="flex items-center mb-2">
                                <img
                                    src={review.productImageUrl}
                                    alt={review.productName}
                                    className="w-12 h-12 object-cover rounded-full mr-3"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{review.username}</h3>
                                    <p className="text-sm text-gray-500">
                                        Продукт: {review.productName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center mb-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-5 h-5 ${
                                                index < review.rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.62 4.978h5.207c.969 0 1.371 1.24.588 1.81l-4.2 3.012 1.62 4.978c.3.921-.755 1.688-1.538 1.118l-4.2-3.012-4.2 3.012c-.783.57-1.838-.197-1.538-1.118l1.62-4.978-4.2-3.012c-.783-.57-.381-1.81.588-1.81h5.207l1.62-4.978z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700">{review.reviewText}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rating;