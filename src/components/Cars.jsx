import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Cars.css";

const Cars = ({ cars = [], search, setSearch }) => {
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cars component mounted!");
    console.log("Received cars:", cars);
    console.log("Search Term:", search);
  }, [cars, search]);

  const filteredCars = useMemo(() => {
    return cars.filter(
      (car) =>
        (car.name?.toLowerCase().includes(search.toLowerCase())) ||
        (car.brand?.toLowerCase().includes(search.toLowerCase())) ||
        (car.make?.toLowerCase().includes(search.toLowerCase())) ||
        (car.model?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [cars, search]);

  // Predefined images from public folder
  const carImages = ["/img1.png", "/img2.jpeg", "/img3.jpg"];

  // Fallback image handler
  const handleImageError = (e) => {
    e.target.src = "/car-default.png";
  };

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
      navigate(`/car/${carId}`);
    } else {
      // No car found - set error message
      setSearchError("No matching cars found. Please try a different search term.");
      // Clear error after 3 seconds
      setTimeout(() => setSearchError(""), 3000);
    }
  };

  return (
    <div className="cars-container">
      <h1 className="text-3xl font-bold text-center mb-6">
        Explore Our Car Listings
      </h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by Brand or Name"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        
        {searchError && (
          <div className="search-error">
            {searchError}
          </div>
        )}
      </div>

      <div className="car-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map((car, index) => {
            const carId = car.carId || car._id;
            if (!carId) {
              console.warn("Car missing ID:", car);
              return null;
            }

            // Static assignment to image (avoid flickering)
            const imageIndex = index % carImages.length;
            const assignedImage = carImages[imageIndex];

            return (
              <div key={carId} className="car-card">
                <img
                  src={assignedImage}
                  alt={car.name || car.make || "Car Image"}
                  className="car-image"
                  loading="lazy"
                  onError={handleImageError}
                  style={{ objectFit: "cover", width: "100%", height: "200px" }}
                />

                <div className="car-info">
                  <h2 className="car-title">{car.name || car.make + " " + car.model || "No Name"}</h2>
                  <p className="car-brand">🚗 {car.brand || car.make || "Unknown Brand"}</p>
                  <p className="car-price">💰 ${car.price || "N/A"}</p>
                  <Link to={`/car/${carId}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No cars found.</p>
        )}
      </div>
    </div>
  );
};

export default Cars;