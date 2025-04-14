import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Userprofile.css";

const API_BASE_URL = "http://127.0.0.1:8000/api/users/user/profile/";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ full_name: "", email: "", profilePicture: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("No token found! Redirecting to login...");
      navigate("/login");
      return;
    }

    axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUser(response.data);
      setUpdatedUser({ 
        full_name: response.data.full_name, 
        email: response.data.email, 
        profilePicture: response.data.profilePicture 
      });
    })
    .catch(error => {
      console.error("Error fetching profile:", error.response?.data || error.message);
      setError("Failed to load profile. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleSaveProfile = () => {
    const token = localStorage.getItem("access_token");

    axios.put(API_BASE_URL, updatedUser, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUser(response.data);
      setIsEditing(false);
    })
    .catch(error => {
      console.error("Error updating profile:", error.response?.data || error.message);
      setError("Failed to update profile. Please try again.");
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Dark Mode Toggle */}
      <button
        className="dark-mode-toggle"
        onClick={() => setDarkMode((prevMode) => !prevMode)}
      >
        {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : user ? (
        <div className="profile-box">
          {/* Profile Picture */}
          <img
            src={updatedUser.profilePicture || "/assets/default-avatar.png"}
            alt="Profile"
            className="profile-pic"
          />

          {isEditing ? (
            <>
              <input
                type="text"
                name="full_name"
                value={updatedUser.full_name}
                onChange={handleInputChange}
                className="profile-input"
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="profile-input"
              />
              <input
                type="text"
                name="profilePicture"
                placeholder="Profile Picture URL"
                value={updatedUser.profilePicture}
                onChange={handleInputChange}
                className="profile-input"
              />
              <button onClick={handleSaveProfile} className="save-profile">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-edit">Cancel</button>
            </>
          ) : (
            <>
              <h2>{user.full_name}</h2>
              <p>Email: {user.email}</p>

              {/* Profile Actions */}
              <div className="profile-actions">
                <button className="edit-profile" onClick={() => setIsEditing(true)}>Edit Profile</button>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="error-message">Profile not found.</p>
      )}
    </div>
  );
};

export default UserProfile;