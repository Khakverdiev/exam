import React from "react";
import Footer from "./Footer";

const Delivery = () => {
    return (
        <>
            <br />
            <br />
            <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Delivery Information</h1>
                <p className="text-lg text-center mb-8 max-w-2xl text-gray-600">
                    We are committed to ensuring your order is delivered quickly and securely. Below is the information about our delivery options available across Azerbaijan.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Delivery Options</h2>
                <ul className="list-disc list-inside mb-6 max-w-2xl text-gray-700">
                    <li>Standard Delivery (1-3 business days)</li>
                    <li>Express Delivery (same-day delivery available in Baku)</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Delivery Costs</h2>
                <p className="text-lg text-center mb-6 max-w-2xl text-gray-600">
                    Delivery costs are calculated during checkout based on your region. Orders within Baku are eligible for discounted delivery rates.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Tracking</h2>
                <p className="text-lg text-center mb-6 max-w-2xl text-gray-600">
                    Once your order is shipped, you will receive an email with a tracking number to monitor your delivery status.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Delivery Policies</h2>
                <p className="text-lg text-center mb-6 max-w-2xl text-gray-600">
                    - Please ensure someone is available to receive the package at the specified delivery address. <br />
                    - If you are unavailable, the courier will leave a note with instructions for rescheduling the delivery. <br />
                    - We are not responsible for lost or stolen packages after delivery is completed.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
                <p className="text-lg text-center mb-6 max-w-2xl text-gray-600">
                    For any questions related to delivery, feel free to contact our support team at{" "}
                    <a href="mailto:support@gmail.com" className="text-blue-500 hover:underline">
                        support@gmail.com
                    </a>.
                </p>
            </div>
            <Footer />
        </>
    );
};

export default Delivery;