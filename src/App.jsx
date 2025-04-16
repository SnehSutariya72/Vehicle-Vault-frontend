// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Login from "./users/Login";
import Signup from "./users/Signup";
import About from "./components/About/About";
import CarsList from "./components/CarsList";
import CarDetails from "./components/CarDetails";
import Agents from "./components/Agents";
import AdminPanel from "./components/AdminPanel"; // Import the AdminPanel component
import "./Style.css";
import Dashboard from "./users/Dashboard";
import UserProfile from "./users/UserProfile";
import { AuthProvider } from "./AuthContext.jsx";

const App = () => {
  const [cars, setCars] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [searchError, setSearchError] = useState("");

  // Fetch Cars
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/cars/get_cars")
      .then((response) => {
        console.log("Fetched Cars:", response.data);

        const updatedCars = response.data.map((car, index) => ({
          ...car,
          image: `/images/car${(index % 5) + 1}.png`,
        }));

        setCars(updatedCars);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
        setLoading(false);
      });
  }, []);

  // Fetch Agents
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/agents/agents")
      .then((response) => {
        console.log("Fetched Agents:", response.data);
        setAgents(response.data);
        setLoadingAgents(false);
      })
      .catch((error) => {
        console.error("Error fetching agents:", error);
        setLoadingAgents(false);
      });
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    // Check if any car matches the search criteria
    const foundCar = cars.find(
      car => 
        (car.name && car.name.toLowerCase().includes(search.toLowerCase())) || 
        (car.brand && car.brand.toLowerCase().includes(search.toLowerCase())) ||
        (car.make && car.make.toLowerCase().includes(search.toLowerCase())) ||
        (car.model && car.model.toLowerCase().includes(search.toLowerCase()))
    );

    if (foundCar) {
      // Car found - programmatically navigate to car details page
      const carId = foundCar._id || foundCar.carId;
      window.location.href = `/car/${carId}`;
    } else {
      // No car found - set error message
      setSearchError("No matching cars found. Please try a different search term.");
      // Clear error after 3 seconds
      setTimeout(() => setSearchError(""), 3000);
    }
  };

  return (
    <Router>
      <div className="app-container bg-gray-50 min-h-screen font-sans text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminPanel />} /> {/* Added Admin Panel Route */}

          {/* Cars Page */}
          <Route
            path="/cars"
            element={
              loading ? (
                <p className="text-center mt-10">Loading cars...</p>
              ) : (
                <CarsList cars={cars} search={search} setSearch={setSearch} />
              )
            }
          />

          {/* Car Details */}
          <Route path="/car/:id" element={<CarDetails />} />

          {/* Agents Page */}
          <Route
            path="/agents"
            element={
              loadingAgents ? (
                <p className="text-center mt-10">Loading agents...</p>
              ) : (
                <Agents agents={agents} />
              )
            }
          />

          {/* Homepage with car background */}
          <Route
            path="/"
            element={
              <div
                className="main-content flex flex-col items-center justify-center text-center px-6"
                style={{
                  backgroundImage: `url('/background.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: "100vh",
                  paddingTop: "100px",
                }}
              >
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-xl max-w-4xl w-full">
                  <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Find Your Dream Car Today
                  </h1>

                  <form onSubmit={handleSearchSubmit} className="flex justify-center gap-4">
                    <input
                      type="text"
                      placeholder="Search Make or Model"
                      className="w-full max-w-md p-4 border rounded-lg shadow-sm focus:ring focus:ring-indigo-400 text-lg"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 text-lg"
                    >
                      Search
                    </button>
                  </form>
                  
                  {searchError && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {searchError}
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;