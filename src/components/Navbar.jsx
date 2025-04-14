import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    // Listen for storage changes in case user logs in/out in another tab
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken"); // Remove authentication token
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={() => navigate("/")}>
        <img
          src="/logo.jpeg"  // Path to the logo inside the public folder
          alt="Logo"
          className="logo-image"
        />
        <h1 className="logo"></h1>
      </div>

      <div className="nav-links">
        <button className="nav-link" onClick={() => navigate("/")}>Home</button>
        <button className="nav-link" onClick={() => navigate("/Cars")}>Cars</button>
        <button className="nav-link" onClick={() => navigate("/agents")}>Agents</button>
        <button className="nav-link" onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>

      <div className="nav-buttons">
        {isAuthenticated ? (
          <div className="profile-menu">
            <img
              src="/profile-icon.png" // Replace with actual user profile picture if available
              alt="Profile"
              className="profile-icon"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="dropdown">
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="login-button" onClick={() => navigate("/login")}>Login</button>
            <button className="signup-button" onClick={() => navigate("/signup")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
