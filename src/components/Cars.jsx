import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Cars.css"; // Make sure you have this or use Properties.css

const Cars = ({ cars = [], search, setSearch }) => {
  useEffect(() => {
    console.log("Cars component mounted!");
    console.log("Received cars:", cars);
    console.log("Search Term:", search);
  }, [cars, search]);

  const filteredCars = cars.filter(
    (car) =>
      car.name?.toLowerCase().includes(search.toLowerCase()) ||
      car.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cars-container">
      <h1 className="text-3xl font-bold text-center mb-6">
        Explore Our Car Listings
      </h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by Brand or Name"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>

      <div className="car-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => {
            const carId = car.carId || car._id;
            if (!carId) {
              console.warn("Car missing ID:", car);
              return null;
            }

            return (
              <div key={carId} className="car-card">
                <img
                  src={car.image || "/car-default.png"} // Use default image fallback
                  alt={car.name || "Car Image"}
                  className="car-image"
                />

                <div className="car-info">
                  <h2 className="car-title">{car.name || "No Name"}</h2>
                  <p className="car-brand">🚗 {car.brand || "Unknown Brand"}</p>
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
