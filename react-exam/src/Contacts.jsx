import React from "react";
import Footer from "./Footer";


const Contacts = () => {
    return (
        <>
        <br></br>
        <br></br>
        <div className="flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-center mb-8 max-w-2xl">
                If you have any questions, feel free to reach out to us! We're here to help you.
            </p>

            <div className="w-full max-w-md">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Your Email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="message"
                            rows="4"
                            placeholder="Your Message"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-black hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-lg text-center mb-2">Email: support@example.com</p>
            <p className="text-lg text-center mb-2">Phone: +1 (234) 567-890</p>
            <p className="text-lg text-center mb-2">Address: 123 Fashion St, Style City, 12345</p>
        </div>
        <Footer></Footer>
        </>
    );
};

export default Contacts;