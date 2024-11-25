import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Clothing Store</h2>
          <p className="text-gray-400">The best place to find your favorite outfits</p>
        </div>

        <div className="flex justify-center space-x-8 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-transform transform hover:scale-110"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-transform transform hover:scale-110"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-transform transform hover:scale-110"
          >
            <FaInstagram size={24} />
          </a>
        </div>

        <div className="flex justify-center space-x-6 text-gray-400 text-sm mb-6">
          <a href="/about-us" className="hover:text-white transition">About Us</a>
          <a href="/delivery" className="hover:text-white transition">Delivery & Payment</a>
          <a href="/contacts" className="hover:text-white transition">Contacts</a>
          <a href="/reviews" className="hover:text-white transition">Reviews</a>
        </div>

        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} Clothing Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;