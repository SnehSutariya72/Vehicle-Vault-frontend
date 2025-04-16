import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Userprofile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role_id: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("No token found! Redirecting to login...");
      navigate("/login");
      return;
    }

    axios.get("http://localhost:8000/api/users/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("User data received:", response.data);
      setUser(response.data);
      
      // Log the entire response to see its structure
      console.log("Full API response:", response);
      
      // Try to find the user ID from various possible locations in the response
      let id;
      if (response.data._id) {
        id = response.data._id;
      } else if (response.data.id) {
        id = response.data.id;
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        // If the response is an array, use the first item
        id = response.data[0]._id || response.data[0].id;
        // Also update the user state to use the first item
        setUser(response.data[0]);
      }
      
      // If we still don't have an ID, check for it in local storage as a backup
      if (!id) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        id = storedUser._id || storedUser.id;
      }
      
      console.log("User ID determined to be:", id);
      setUserId(id);
      
      // Make sure we're getting the correct user object
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      
      setUpdatedUser({
        name: userData.name || userData.full_name || "",
        email: userData.email || "",
        password: "", // Empty by default for security
        phone: userData.phone || "",
        role_id: userData.role_id || ""
      });
    })
    .catch(error => {
      console.error("Error fetching profile:", error.response?.data || error.message);
      setError("Failed to load profile. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleSaveProfile = () => {
    const token = localStorage.getItem("authToken");
    
    if (!userId) {
      console.error("No user ID available for update");
      setError("Unable to update profile: User ID not found");
      return;
    }
    
    console.log("Sending update for user ID:", userId);
    console.log("Update data:", updatedUser);
    
    // Include all fields that the backend expects
    const dataToSend = {
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password || user.password || "",
      phone: updatedUser.phone || "",
      role_id: updatedUser.role_id || user.role_id || "",
      updated_at: new Date().toISOString()
    };

    const updateUrl = "http://localhost:8000/api/users/" + userId;
    console.log("Update URL:", updateUrl);

    axios.put(updateUrl, dataToSend, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => {
      console.log("Update successful:", response.data);
      setUser(response.data);
      setIsEditing(false);
      setError("");
    })
    .catch(error => {
      console.error("Error updating profile:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError("Failed to update profile. Please try again.");
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
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

      {/* Debug Info - Remove in production */}
      <div className="debug-info" style={{fontSize: "10px", color: "#999", marginBottom: "10px"}}>
        User ID: {userId || "Not found"}
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : user ? (
        <div className="profile-box">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                value={updatedUser.password}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Password (leave blank to keep current)"
              />
              <input
                type="text"
                name="phone"
                value={updatedUser.phone}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Phone Number"
              />
              <input
                type="text"
                name="role_id"
                value={updatedUser.role_id}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Role ID"
                readOnly={true}
              />
              
              <div className="form-actions">
                <button onClick={handleSaveProfile} className="save-profile">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-edit">Cancel</button>
              </div>
              
              {error && <p className="error-message">{error}</p>}
            </>
          ) : (
            <>
              <h2>{user.name || user.full_name}</h2>
              <p>Email: {user.email}</p>
              {user.phone && <p>Phone: {user.phone}</p>}
              {user.role_id && <p>Role ID: {user.role_id}</p>}

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