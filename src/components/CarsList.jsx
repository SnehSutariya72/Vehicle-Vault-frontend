import { useEffect, useState } from "react";

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/cars/get_cars") // Replace with your actual API
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
              <img
                src={
                  car.image
                    ? `http://localhost:8000/uploads/${car.image}`
                    : "/images/car-default.png"
                }
                alt={`${car.make} ${car.model}`}
                onError={(e) => {
                  e.target.src = "/images/car-default.png"; // Fallback image
                }}
              />
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
