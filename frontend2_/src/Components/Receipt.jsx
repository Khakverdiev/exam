import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Receipt = () => {
  const { orderId } = useParams(); // Получаем `orderId` из URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7193/api/order/${orderId}`);
        setOrderDetails(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const generatePDF = () => {
    if (!orderDetails?.orderItems?.$values?.length) {
      console.error("No items available for generating PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Order Receipt", 20, 20);
    doc.text(`Order Date: ${new Date(orderDetails.createdAt).toLocaleDateString()}`, 20, 30);

    const tableData = orderDetails.orderItems.$values.map((item) => [
      item.productId || "N/A",
      item.quantity || "N/A",
      `$${item.price?.toFixed(2) || "N/A"}`,
      item.size || "N/A",
    ]);

    doc.autoTable({
      head: [["Product ID", "Quantity", "Price", "Size"]],
      body: tableData,
      startY: 40,
    });

    doc.text(`Total Price: $${orderDetails.totalPrice?.toFixed(2) || "N/A"}`, 20, doc.lastAutoTable.finalY + 10);
    doc.save("receipt.pdf");
  };

  if (loading) return <p>Loading receipt details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Order Receipt</h2>
        <p className="text-lg mb-2">
          <strong>Order Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}
        </p>

        {orderDetails.shippingAddress && (
          <div className="text-lg mb-4">
            <p>
              <strong>Shipping Address:</strong>{" "}
              {`${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}, ${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}, ${orderDetails.shippingAddress.zipCode}`}
            </p>
            <p>
              <strong>Phone Number:</strong> {orderDetails.shippingAddress.phoneNumber}
            </p>
          </div>
        )}

        <h3 className="text-xl font-bold mb-2">Items:</h3>
        <ul className="list-disc pl-5">
          {orderDetails.orderItems.$values.map((item) => (
            <li key={item.id}>
              {item.quantity} x Product ID: {item.productId} ({item.size || "N/A"}) - $
              {item.price.toFixed(2)}
            </li>
          ))}
        </ul>

        <p className="text-lg font-bold mt-4">Total Price: ${orderDetails.totalPrice.toFixed(2)}</p>

        <button
          onClick={generatePDF}
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Receipt;