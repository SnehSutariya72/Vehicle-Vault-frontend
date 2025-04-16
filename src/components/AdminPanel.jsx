import { useEffect, useState } from "react";
import "../css/AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true);
      } else {
        setError("You need to log in to access this page");
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        checkAuthStatus();

        // Only fetch data if authenticated
        if (localStorage.getItem("authToken")) {
          // Fetch users
          const usersResponse = await fetch("http://localhost:8000/api/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          if (!usersResponse.ok) throw new Error("Failed to fetch users");
          const usersData = await usersResponse.json();
          setUsers(usersData);

          // Fetch cars
          const carsResponse = await fetch("http://localhost:8000/api/cars/get_cars");
          if (!carsResponse.ok) throw new Error("Failed to fetch cars");
          const carsData = await carsResponse.json();
          setCars(carsData);

          // Set stats
          setStats({
            totalUsers: usersData.length,
            totalCars: carsData.length,
          });
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      // Update users list
      setUsers(users.filter(user => user._id !== userId));
      // Update stats
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/cars/delete_car/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete car");

      // Update cars list
      setCars(cars.filter(car => car._id !== carId));
      // Update stats
      setStats(prev => ({
        ...prev,
        totalCars: prev.totalCars - 1
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading admin panel...</div>;
  if (error) return <div className="admin-error">{error}</div>;
  if (!isAuthenticated) return <div className="admin-error">Please log in to access this page.</div>;

  return (
    <div className="admin-panel">
      <h1 className="admin-panel-title">Admin Panel</h1>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`admin-tab ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          Cars
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="admin-dashboard">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Cars</h3>
              <p className="stat-number">{stats.totalCars}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-users">
          <h2>Manage Users</h2>
          <div className="users-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name || user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.role_id || "user"}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cars' && (
        <div className="admin-cars">
          <h2>Manage Cars</h2>
          <div className="cars-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Price</th>
                  <th>Color</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan="5">No cars found</td>
                  </tr>
                ) : (
                  cars.map(car => (
                    <tr key={car._id}>
                      <td>{car.make}</td>
                      <td>{car.model}</td>
                      <td>${car.price}</td>
                      <td>{car.color}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteCar(car._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;