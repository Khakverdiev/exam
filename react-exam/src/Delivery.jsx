import React from "react";
import Footer from "./Footer";

const Delivery = () => {
    return (
        <>
            <div className="flex flex-col items-center px-2 sm:px-4 py-4 mt-16">
                <h1 className="text-lg sm:text-2xl font-bold mb-4 text-center">Delivery Information</h1>
                <p className="text-sm sm:text-base text-center mb-6 max-w-md">
                    We strive to ensure that your order arrives as quickly and safely as possible. Below you will find our delivery options and policies.
                </p>

                <h2 className="text-base sm:text-lg font-semibold mb-3">Delivery Options</h2>
                <ul className="list-disc list-inside mb-4 max-w-md text-left sm:text-center text-sm sm:text-base">
                    <li>Standard Delivery (3-5 business days)</li>
                    <li>Express Delivery (1-2 business days)</li>
                    <li>Same-Day Delivery (available in select areas)</li>
                </ul>

                <h2 className="text-base sm:text-lg font-semibold mb-3">Delivery Costs</h2>
                <p className="text-sm sm:text-base text-center mb-4 max-w-md">
                    Delivery costs are calculated at checkout based on your location and the delivery method selected.
                </p>

                <h2 className="text-base sm:text-lg font-semibold mb-3">Order Tracking</h2>
                <p className="text-sm sm:text-base text-center mb-4 max-w-md">
                    Once your order has been shipped, you will receive an email with a tracking number so you can monitor your delivery.
                </p>

                <h2 className="text-base sm:text-lg font-semibold mb-3">Delivery Policies</h2>
                <p className="text-sm sm:text-base text-center mb-4 max-w-md">
                    - Please ensure that someone is available to receive the package at the delivery address. <br />
                    - If you are not available, the courier will leave a note with instructions for rescheduling delivery. <br />
                    - We are not responsible for lost or stolen packages once they have been delivered.
                </p>

                <h2 className="text-base sm:text-lg font-semibold mb-3">Contact Us</h2>
                <p className="text-sm sm:text-base text-center mb-4 max-w-md">
                    If you have any questions regarding delivery, please contact our support team at <a href="mailto:support@gmail.com" className="text-blue-500">support@gmail.com</a>.
                </p>
            </div>
            <Footer />
        </>
    );
};

export default Delivery;