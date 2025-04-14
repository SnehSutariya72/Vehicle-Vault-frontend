import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/CarDetails.css"; // Style file for car details

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState("/images/car-default.png");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:8000/api/cars/get_car/${id}`)
      .then((response) => {
        const carData = response.data;

        const index = Math.floor(Math.random() * 4) + 1;
        const imagePath = `/images/car${index}.png`;

        setCar({ ...carData, image: carData.image || imagePath });
        setImageSrc(carData.image || imagePath);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading car details...</p>;
  if (!car) return <p>Car not found.</p>;

  return (
    <div className="car-details-container">
      <div className="car-details">
        <img
          src={imageSrc}
          alt={car.make + " " + car.model}
          className="car-image"
          onError={() => setImageSrc("/images/car-default.png")}
        />

        <h2>{car.make} {car.model}</h2>
        <p><strong>Price:</strong> ${car.price.toLocaleString()}</p>
        <p><strong>Color:</strong> {car.color}</p>
        <p><strong>Kilometers Driven:</strong> {car.kmsDriven} km</p>
        <p><strong>City:</strong> {car.cityId}</p>

        <button className="call-now-btn" onClick={() => navigate("/dealers")}>
          📞 Contact Dealer
        </button>
      </div>
    </div>
  );
};

export default CarDetails;
