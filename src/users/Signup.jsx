import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Style.css";

const API_BASE_URL = "http://127.0.0.1:8000"; // FastAPI Backend URL

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "", // ✅ Changed from full_name to name
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // ✅ Prevent submission if fields are empty
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required!");
      return;
    }

    // ✅ Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true); // ✅ Show loading state

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup/`, {
        name: formData.name, // ✅ Ensure backend expects `name`
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data);
      const errorMessage = err.response?.data?.detail;

      if (Array.isArray(errorMessage)) {
        setError(errorMessage.map((err) => err.msg).join(", "));
      } else if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("Signup failed! Try again.");
      }
    } finally {
      setLoading(false); // ✅ Hide loading state
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Sign Up</h2>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="auth-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
              {showPassword ? "👁️" : "🔒"}
            </button>
          </div>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              className="auth-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="button" className="eye-button" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? "👁️" : "🔒"}
            </button>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;