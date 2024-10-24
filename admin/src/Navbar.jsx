import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";

const Navbar = () => {
    const { username, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogoutClick = () => {
        handleLogout();
        navigate("/login");
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <nav className="bg-black text-white py-4 px-6 fixed w-full z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link to="/">Admin Panel</Link>
                </div>

                <div className="hidden md:flex space-x-6">
                    <Link to="/product" className="hover:text-gray-300">
                        Products
                    </Link>
                    <Link to="/rating" className="hover:text-gray-300">
                        Ratings
                    </Link>
                    <Link to="/role" className="hover:text-gray-300">
                        Role
                    </Link>
                    <Link to="/orders" className="hover:text-gray-300">
                        Orders
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {username && (
                        <span className="hidden md:inline-block">{`${username}`}</span>
                    )}
                    <button
                        onClick={handleLogoutClick}
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                <div className="md:hidden">
                    <button
                        className="text-white focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-black text-white p-4 space-y-4">
                    <Link to="/product" className="block hover:text-gray-300" onClick={toggleMenu}>
                        Products
                    </Link>
                    <Link to="/rating" className="block hover:text-gray-300" onClick={toggleMenu}>
                        Ratings
                    </Link>
                    <Link to="/role" className="block hover:text-gray-300" onClick={toggleMenu}>
                        Role
                    </Link>
                    <Link to="/orders" className="block hover:text-gray-300" onClick={toggleMenu}>
                        Orders
                    </Link>
                    <button
                        onClick={() => {
                            handleLogoutClick();
                            toggleMenu();
                        }}
                        className="bg-red-600 w-full py-2 rounded hover:bg-red-700 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;