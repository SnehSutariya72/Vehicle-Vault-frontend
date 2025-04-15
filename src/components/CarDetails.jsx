import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/CarDetails.css";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState("/car-default.png");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/api/cars/get_car/${id}`)
      .then((response) => {
        const carData = response.data;

        // Stable image selection (based on ID or fallback)
        const carIndex = Math.abs((carData._id || carData.carId || "").toString().split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % 3;
        const fallbackImage = `/img${carIndex + 1}.jpg`; // assuming images are img1.jpg, img2.jpeg, etc.

        const image = carData.image || fallbackImage;

        setCar(carData);
        setImageSrc(image);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading car details...</p>;
  if (!car) return <p className="text-center mt-10">Car not found.</p>;

  return (
    <div className="car-details-container">
      <div className="car-details">
        <img
          src={imageSrc}
          alt={`${car.make || "Car"} ${car.model || ""}`}
          className="car-image"
          loading="lazy"
          onError={() => setImageSrc("/car-default.png")}
          style={{ objectFit: "cover", width: "100%", height: "300px" }}
        />

        <h2>{car.make} {car.model}</h2>
        <p><strong>Price:</strong> ${car.price?.toLocaleString() || "N/A"}</p>
        <p><strong>Color:</strong> {car.color || "N/A"}</p>
        <p><strong>Kilometers Driven:</strong> {car.kmsDriven || "N/A"} km</p>
        <p><strong>City:</strong> {car.cityId || "Unknown"}</p>

        <button className="call-now-btn" onClick={() => navigate("/dealers")}>
          📞 Contact Dealer
        </button>
      </div>
    </div>
  );
};

export default CarDetails;
