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
    <nav className="w-full p-4 fixed top-0 left-0 z-50 bg-black text-white">
      <div className="flex items-center justify-between">
        <div className="absolute left-4 flex items-center">
          <img
            src={process.env.PUBLIC_URL + "/cloth.png"}
            alt="Cloth Icon"
            className="h-8 w-8"
          />
          <button
            className="ml-2 block md:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <div className={`w-6 h-1 bg-white mb-1 ${isMenuOpen ? "rotate-45 transform translate-y-2" : ""}`}></div>
            <div className={`w-6 h-1 bg-white mb-1 ${isMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-6 h-1 bg-white ${isMenuOpen ? "-rotate-45 transform -translate-y-2" : ""}`}></div>
          </button>
        </div>

        <div className="w-full flex justify-center">
          <ul className="hidden md:flex space-x-8">
            <li><Link to="/home" className="text-lg font-semibold hover:underline">Home</Link></li>
            <li><Link to="/about-us" className="text-lg font-semibold hover:underline">About Us</Link></li>
            <li><Link to="/contacts" className="text-lg font-semibold hover:underline">Contacts</Link></li>
            <li><Link to="/delivery" className="text-lg font-semibold hover:underline">Delivery and Payment</Link></li>
          </ul>
        </div>

        <div className="absolute right-4 flex items-center">
          <Link to="/cart" className="text-lg font-semibold hover:underline mr-4">
            <img src={process.env.PUBLIC_URL + "/k.png"} alt="Cart Icon" className="h-8 w-8 object-contain inline-block" />
          </Link>
          {username ? (
            <>
              <Link to="/profile" className="text-lg font-semibold hover:underline">{username}</Link>
              <button onClick={handleLogoutClick} className="ml-4">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-lg font-semibold hover:underline">Login</Link>
          )}
        </div>
      </div>

      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} bg-black w-full mt-4`}>
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li><Link to="/home" className="text-lg font-semibold hover:underline" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about-us" className="text-lg font-semibold hover:underline" onClick={toggleMenu}>About Us</Link></li>
          <li><Link to="/contacts" className="text-lg font-semibold hover:underline" onClick={toggleMenu}>Contacts</Link></li>
          <li><Link to="/delivery" className="text-lg font-semibold hover:underline" onClick={toggleMenu}>Delivery and Payment</Link></li>
          {username ? (
            <>
              <li><Link to="/profile" className="text-lg font-semibold hover:underline" onClick={toggleMenu}>{username}</Link></li>
              <li><button onClick={() => { handleLogoutClick(); toggleMenu(); }} className="text-lg font-semibold hover:underline">Logout</button></li>
            </>
          ) : (
            <li><Link to="/login" className="text-lg font-semibold hover:underline" onClick={toggleMenu}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
