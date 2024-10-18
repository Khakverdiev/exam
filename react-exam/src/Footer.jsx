import React from "react";

const Footer = () => {
    return(
        <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Clothing Store</h2>
            <br></br>
            <p className="text-gray-400">Best place to buy awesome hoodies</p>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            <a
              href="https://facebook.com"
              className="text-gray-400 hover:text-white transition"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              className="text-gray-400 hover:text-white transition"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              className="text-gray-400 hover:text-white transition"
            >
              Instagram
            </a>
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Clothing Store. All rights
            reserved.
          </p>
        </div>
      </footer>
    );
}

export default Footer;