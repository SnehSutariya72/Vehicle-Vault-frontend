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

          {/* Homepage */}
          <Route
            path="/"
            element={
              <div className="main-content flex flex-col items-center justify-center text-center p-6">
                <div className="search-section w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
                  <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Find Your Dream Car Today
                  </h1>

                  <div className="search-bar-container flex justify-center gap-4">
                    <input
                      type="text"
                      placeholder="Search Make or Model"
                      className="search-input w-full max-w-md p-4 border rounded-lg shadow-sm focus:ring focus:ring-indigo-400 text-lg"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="search-button px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 text-lg">
                      Search
                    </button>
                  </div>
                </div>

                <div className="image-section mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1583267745194-542d02f71c5c"
                    alt="Car Background"
                    className="search-image w-full max-w-5xl rounded-lg shadow-2xl border-4 border-gray-200"
                  />
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
