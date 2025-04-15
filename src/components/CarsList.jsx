import { useEffect, useState } from "react";

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({}); // Track loaded images

  useEffect(() => {
    fetch("http://localhost:8000/api/cars/get_cars")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched cars:", data);
        setCars(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
        setLoading(false);
      });
  }, []);

  // Handle image load event
  const handleImageLoad = (carId) => {
    setImagesLoaded((prev) => ({ ...prev, [carId]: true }));
  };

  if (loading) {
    return <p>Loading cars...</p>;
  }

  return (
    <div>
      <h2>🚗 Available Cars for Sale</h2>
      <div className="car-container">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.carId} className="car-card">
              {/* 
              <div className="image-container">
                <img
                  src={
                    car.image
                      ? `http://localhost:8000/uploads/${car.image}`
                      : "/images/car-default.png"
                  }
                  alt={`${car.make} ${car.model}`}
                  onError={(e) => {
                    e.target.src = "/images/car-default.png";
                  }}
                  onLoad={() => handleImageLoad(car.carId)}
                  style={{
                    opacity: imagesLoaded[car.carId] ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                  loading="lazy"
                />
              </div>
              */}
              <h3>{car.make} {car.model}</h3>
              <p>💰 ${car.price}</p>
              <p>🎨 Color: {car.color}</p>
              <p>📍 City: {car.cityId}</p>
              <p>🚗 {car.kmsDriven} km driven</p>
            </div>
          ))
        ) : (
          <p>No cars found.</p>
        )}
      </div>
    </div>
  );
};

export default CarsList;
