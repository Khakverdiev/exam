import React from "react";
import Footer from "./Footer";

const Contacts = () => {
    return (
        <>
            <br></br>
            <br></br>
            <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
                <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">Contact Us</h1>
                <p className="text-xl text-center mb-8 max-w-2xl text-gray-600">
                    Have questions or need assistance? Feel free to reach out to us using the information below. We're here to help!
                </p>

                <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-gray-800">
                    <h2 className="text-2xl font-semibold mb-6 text-center border-b-2 pb-2 border-gray-300">
                        Get in Touch
                    </h2>
                    <div className="flex items-center mb-4">
                        <img
                            src="https://img.icons8.com/ios-filled/50/000000/email.png"
                            alt="email icon"
                            className="w-8 h-8 mr-4"
                        />
                        <span className="text-lg">Email: <a href="mailto:support@example.com" className="text-blue-500 hover:underline">support@example.com</a></span>
                    </div>
                    <div className="flex items-center mb-4">
                        <img
                            src="https://img.icons8.com/ios-filled/50/000000/phone.png"
                            alt="phone icon"
                            className="w-8 h-8 mr-4"
                        />
                        <span className="text-lg">Phone: +1 (234) 567-890</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <img
                            src="https://img.icons8.com/ios-filled/50/000000/home.png"
                            alt="address icon"
                            className="w-8 h-8 mr-4"
                        />
                        <span className="text-lg">Address: 123 Fashion St, Style City, 12345</span>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Follow Us</h2>
                    <div className="flex justify-center mt-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-4">
                            <img
                                src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png"
                                alt="Facebook"
                                className="w-10 h-10 hover:scale-110 transition transform duration-200"
                            />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-4">
                            <img
                                src="https://img.icons8.com/ios-filled/50/000000/twitter.png"
                                alt="Twitter"
                                className="w-10 h-10 hover:scale-110 transition transform duration-200"
                            />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-4">
                            <img
                                src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png"
                                alt="Instagram"
                                className="w-10 h-10 hover:scale-110 transition transform duration-200"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default Contacts;