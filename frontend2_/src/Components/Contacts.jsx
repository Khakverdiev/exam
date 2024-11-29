import React from "react";
import Footer from "./Footer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Contacts = () => {
    return (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <h1 className="text-5xl font-extrabold mb-8 text-center">Contact Us</h1>
            <p className="text-xl text-center mb-8 max-w-2xl">
              Have questions or need assistance? Feel free to reach out to us using the information below. We're here to help!
            </p>
    
            <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full">
              <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
              <div className="flex items-center mb-6">
                <FaEnvelope className="text-purple-400 w-8 h-8 mr-4" />
                <span className="text-lg">
                  Email:{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-purple-400 hover:underline"
                  >
                    support@example.com
                  </a>
                </span>
              </div>
              <div className="flex items-center mb-6">
                <FaPhone className="text-purple-400 w-8 h-8 mr-4" />
                <span className="text-lg">Phone: +1 (234) 567-890</span>
              </div>
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="text-purple-400 w-8 h-8 mr-4" />
                <span className="text-lg">
                  Address: 123 Fashion St, Style City, 12345
                </span>
              </div>
            </div>
    
            <div className="mt-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Follow Us</h2>
              <div className="flex justify-center space-x-8">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-white transition-transform transform hover:scale-110"
                >
                  <FaFacebook size={40} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-white transition-transform transform hover:scale-110"
                >
                  <FaTwitter size={40} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-white transition-transform transform hover:scale-110"
                >
                  <FaInstagram size={40} />
                </a>
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
};

export default Contacts;