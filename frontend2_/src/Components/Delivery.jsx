import React from "react";
import Footer from "./Footer";
import { FaTruck, FaMoneyBillWave, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

const Delivery = () => {
    return (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <h1 className="text-5xl font-extrabold mb-8 text-center">Delivery Information</h1>
            <p className="text-lg text-center mb-8 max-w-2xl">
              We are committed to ensuring your order is delivered quickly and securely. Below is the information about our delivery options available across Azerbaijan.
            </p>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
              <div className="bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaTruck className="text-purple-400 w-8 h-8 mr-4" />
                  <h2 className="text-2xl font-bold">Delivery Options</h2>
                </div>
                <ul className="list-disc list-inside text-gray-400">
                  <li>Standard Delivery (1-3 business days)</li>
                  <li>Express Delivery (same-day delivery available in Baku)</li>
                </ul>
              </div>

              <div className="bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaMoneyBillWave className="text-green-400 w-8 h-8 mr-4" />
                  <h2 className="text-2xl font-bold">Delivery Costs</h2>
                </div>
                <p className="text-gray-400">
                  Delivery costs are calculated during checkout based on your region. Orders within Baku are eligible for discounted delivery rates.
                </p>
              </div>
    
              <div className="bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-blue-400 w-8 h-8 mr-4" />
                  <h2 className="text-2xl font-bold">Order Tracking</h2>
                </div>
                <p className="text-gray-400">
                  Once your order is shipped, you will receive an email with a tracking number to monitor your delivery status.
                </p>
              </div>
    
              <div className="bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaInfoCircle className="text-yellow-400 w-8 h-8 mr-4" />
                  <h2 className="text-2xl font-bold">Delivery Policies</h2>
                </div>
                <p className="text-gray-400">
                  - Please ensure someone is available to receive the package at the specified delivery address. <br />
                  - If you are unavailable, the courier will leave a note with instructions for rescheduling the delivery. <br />
                  - We are not responsible for lost or stolen packages after delivery is completed.
                </p>
              </div>
            </div>
    
            <div className="mt-12 text-center max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-400">
                For any questions related to delivery, feel free to contact our support team at{" "}
                <a href="mailto:support@gmail.com" className="text-purple-400 hover:underline">
                  support@gmail.com
                </a>.
              </p>
            </div>
          </div>
          <Footer />
        </>
      );
};

export default Delivery;