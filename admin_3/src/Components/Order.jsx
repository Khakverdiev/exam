import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";

const Order = () => {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 6;

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get("https://localhost:7193/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const ordersData = (response.data.$values || response.data).map((order) => ({
        ...order,
        orderItems: order.orderItems?.$values || [],
      }));
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusUpdate = async (orderId) => {
    const selectedStatus = selectedStatuses[orderId];
    if (!selectedStatus) {
      alert("Please select a status to update.");
      return;
    }

    try {
      const response = await axios.put(
        `https://localhost:7193/api/admin/orders/${orderId}/update-status`,
        selectedStatus,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: response.data.status } : order
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (error) {
      setError("Failed to update order status. Please try again.");
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await axios.delete(`https://localhost:7193/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      setFilteredOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      setError("Failed to delete the order. Please try again.");
      console.error("Error deleting order:", error);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: newStatus,
    }));
  };

  const handleFilterChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = orders.filter(
      (order) =>
        order.id.toString().includes(query) ||
        order.username.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  if (loading) return <p className="text-center text-gray-600 mt-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Orders Management</h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, Username, or Status"
          value={searchQuery}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {displayedOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders match your search criteria.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto bg-white shadow-lg rounded-lg border-collapse border border-gray-200">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 border-r font-semibold text-gray-600">Order ID</th>
                <th className="p-4 border-r font-semibold text-gray-600">Username</th>
                <th className="p-4 border-r font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-4 border-r">{order.id}</td>
                  <td className="p-4 border-r">{order.username}</td>
                  <td className="p-4 border-r">{order.status}</td>
                  <td className="p-4 flex items-center space-x-2">
                    <select
                      value={selectedStatuses[order.id] || ""}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleStatusUpdate(order.id)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Info
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p className="mb-4">
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p className="mb-4">
              <strong>Username:</strong> {selectedOrder.username}
            </p>
            <p className="mb-4">
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p className="mb-4">
              <strong>Total Price:</strong> ${selectedOrder.totalPrice}
            </p>
            <p className="mb-4">
              <strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <h3 className="text-lg font-semibold mb-2">Products:</h3>
            <ul className="list-disc list-inside mb-4">
              {selectedOrder.orderItems.map((item) => (
                <li key={item.id}>
                  <strong>Product ID:</strong> {item.productId}, <strong>Quantity:</strong> {item.quantity},{" "}
                  <strong>Price:</strong> ${item.price}, <strong>Size:</strong> {item.size}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;