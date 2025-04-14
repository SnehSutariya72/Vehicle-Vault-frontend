import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-bold mb-3">Vehicle Vault</h3>
          <p>Your trusted platform for exploring, comparing, and discovering your dream car.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/vehicles" className="hover:text-white">Vehicles</Link></li>
            <li><Link to="/compare" className="hover:text-white">Compare</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Info</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
          <p>Email: support@vehiclevault.com</p>
          <p>Phone: +91-9876543210</p>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} Vehicle Vault. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
