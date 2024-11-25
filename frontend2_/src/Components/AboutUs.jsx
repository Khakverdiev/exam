import React from "react";
import Footer from "./Footer";
import { FaUsers, FaLeaf, FaTrophy, FaEnvelope, FaComments } from "react-icons/fa";

const AboutUs = () => {
    return (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <div className="container mx-auto py-12 px-6">
              {/* Заголовок */}
              <h1 className="text-5xl font-extrabold text-center mb-12">About Us</h1>
    
              {/* Карточки с секциями */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Наша миссия */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition hover:scale-105">
                  <FaTrophy size={50} className="text-purple-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
                  <p className="text-gray-400 text-center">
                    To offer stylish and affordable clothing, allowing you to feel confident and comfortable
                    in any situation. We stay ahead of the latest trends, bringing you the best styles available.
                  </p>
                </div>
    
                {/* Наши ценности */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition hover:scale-105">
                  <FaLeaf size={50} className="text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4 text-center">Our Values</h2>
                  <p className="text-gray-400 text-center">
                    We believe in sustainability and ethical practices. We source responsibly and partner with
                    manufacturers committed to ethical labor standards.
                  </p>
                </div>
    
                {/* Присоединяйтесь к нам */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition hover:scale-105">
                  <FaUsers size={50} className="text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4 text-center">Join Our Community</h2>
                  <p className="text-gray-400 text-center">
                    Follow us on social media for updates, style tips, and exclusive offers. Celebrate individuality
                    and creativity with us.
                  </p>
                </div>
    
                {/* Наша команда */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition hover:scale-105">
                  <FaComments size={50} className="text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4 text-center">Meet Our Team</h2>
                  <p className="text-gray-400 text-center">
                    Our diverse team brings together experience and creativity. Each member contributes their unique
                    perspective, ensuring we deliver the best to our customers.
                  </p>
                </div>
    
                {/* Отзывы клиентов */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition hover:scale-105">
                  <FaComments size={50} className="text-pink-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4 text-center">Customer Testimonials</h2>
                  <p className="text-gray-400 text-center italic">"I've never felt more confident in my outfits! The quality is unmatched." - Jane D.</p>
                  <p className="text-gray-400 text-center italic mt-4">"A fantastic shopping experience with great customer service!" - Mark S.</p>
                </div>
    
                {/* Свяжитесь с нами */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition hover:scale-105">
                  <FaEnvelope size={50} className="text-red-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
                  <p className="text-gray-400 text-center">
                    Have questions? Reach out to us at{" "}
                    <a href="mailto:support@gmail.com" className="text-purple-400 hover:underline">
                      support@gmail.com
                    </a>{" "}
                    or visit our contact page for more options.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
}

export default AboutUs;