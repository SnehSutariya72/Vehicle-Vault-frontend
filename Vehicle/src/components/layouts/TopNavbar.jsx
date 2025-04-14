import React from "react";
import { Link } from "react-router-dom";

const TopNavbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/vite.svg" alt="Vehicle Vault Logo" className="h-8 w-8" />
        <span className="text-xl font-bold text-gray-800">Vehicle Vault</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/vehicles" className="hover:text-blue-600">Vehicles</Link>
        <Link to="/compare" className="hover:text-blue-600">Compare</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
      </div>

      {/* Search & Auth Buttons */}
      <div className="flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Search cars..." 
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Link to="/login">
          <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm">
            Signup
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default TopNavbar;
