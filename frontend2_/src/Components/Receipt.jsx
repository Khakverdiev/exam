import React from "react";
import { useLocation } from "react-router-dom";

const Receipt = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  const { orderItems, shippingAddress, paymentId, createdAt, totalAmount } = orderDetails || {};

  const items = Array.isArray(orderItems?.$values) ? orderItems.$values : orderItems;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-6 max-w-lg bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Order Receipt</h2>

        <p><strong>Order Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
        {shippingAddress && (
          <>
            <p><strong>Shipping Address:</strong> {`${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}, ${shippingAddress.zipCode}`}</p>
            <p><strong>Phone Number:</strong> {shippingAddress.phoneNumber}</p>
          </>
        )}

        <h3 className="font-semibold mt-4">Items:</h3>
        <ul>
        {items && items.map((item) => (
            <li key={item.productId}>
                {item.quantity} x {item.productName || "Product"} ({item.size || "N/A"}) @ ${item.price.toFixed(2)} each
            </li>
        ))}
        </ul>
      </div>
    </div>
  );
};

export default Receipt;
