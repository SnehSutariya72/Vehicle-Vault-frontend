import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "@/App.css"; // ✅

const API_BASE_URL = "http://127.0.0.1:8000"; // FastAPI Backend URL

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.access_token) {
        // ✅ Store the tokens properly
        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token || "");

        // ✅ Store user data if provided by backend
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // ✅ Notify other components of authentication change
        window.dispatchEvent(new Event("storage"));

        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required />
            <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
              {showPassword ? "👁️" : "🔒"}
            </button>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;