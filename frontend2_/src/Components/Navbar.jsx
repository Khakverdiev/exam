import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import { useState } from "react";

const Navbar = () => {
  const { username, handleLogout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/home");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-900 via-black to-gray-800 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={process.env.PUBLIC_URL + "/cloth.png"}
            alt="Logo"
            className="h-10 w-10"
          />
          <h1 className="ml-2 text-2xl font-extrabold hidden md:block">ClothStore</h1>
          <button
            className="ml-4 block md:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <div
              className={`w-6 h-1 bg-white mb-1 transition-transform ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-1 bg-white mb-1 transition-opacity ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-1 bg-white transition-transform ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </button>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/home"
            className="hover:text-purple-400 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className="hover:text-purple-400 transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="/contacts"
            className="hover:text-purple-400 transition duration-300"
          >
            Contacts
          </Link>
          <Link
            to="/delivery"
            className="hover:text-purple-400 transition duration-300"
          >
            Delivery & Payment
          </Link>
          <Link
            to="/reviews"
            className="hover:text-purple-400 transition duration-300"
          >
            Reviews
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative group">
            <img
              src={process.env.PUBLIC_URL + "/k.png"}
              alt="Cart Icon"
              className="h-8 w-8"
            />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 group-hover:scale-110 transition">
                {totalItems}
              </span>
            )}
          </Link>
          {username ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <img
                  src={process.env.PUBLIC_URL + "/human.png"}
                  alt="User Icon"
                  className="h-8 w-8 rounded-full border-2 border-purple-500"
                />
              </Link>
              <button
                onClick={handleLogoutClick}
                className="hover:text-red-400 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:text-purple-400 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-black w-full mt-4`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li>
            <Link
              to="/home"
              className="hover:text-purple-400 transition duration-300"
              onClick={toggleMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about-us"
              className="hover:text-purple-400 transition duration-300"
              onClick={toggleMenu}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contacts"
              className="hover:text-purple-400 transition duration-300"
              onClick={toggleMenu}
            >
              Contacts
            </Link>
          </li>
          <li>
            <Link
              to="/delivery"
              className="hover:text-purple-400 transition duration-300"
              onClick={toggleMenu}
            >
              Delivery & Payment
            </Link>
          </li>
          <li>
            <Link
              to="/reviews"
              className="hover:text-purple-400 transition duration-300"
              onClick={toggleMenu}
            >
              Reviews
            </Link>
          </li>
          {username ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-purple-400 transition duration-300"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogoutClick();
                    toggleMenu();
                  }}
                  className="hover:text-red-400 transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="hover:text-purple-400 transition duration-300"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
