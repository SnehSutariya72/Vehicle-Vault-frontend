import { useEffect, useState } from "react";
import "../css/Agent.css";

const CarManagement = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        price: 0,
        color: "",
        kmsDriven: 0
    });
    const [addingCar, setAddingCar] = useState(false);
    const [newCarData, setNewCarData] = useState({
        make: "",
        model: "",
        price: 0,
        color: "",
        cityId: "",
        kmsDriven: 0
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
        const checkAuth = () => {
            const userData = JSON.parse(localStorage.getItem("userData") || "null");
            if (userData) {
                setCurrentUserId(userData.id);
            }
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                checkAuth();

                // Fetch cities and states
                const citiesResponse = await fetch("http://localhost:8000/api/cities/city");
                if (!citiesResponse.ok) throw new Error("Failed to fetch cities");
                const citiesData = await citiesResponse.json();
                setCities(citiesData);

                // Fetch cars
                const carsResponse = await fetch("http://localhost:8000/api/cars/get_cars");
                if (!carsResponse.ok) throw new Error("Failed to fetch cars");
                const carsData = await carsResponse.json();
                setCars(carsData);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const startEditing = (car) => {
        setEditingCar(car);
        setFormData({
            make: car.make,
            model: car.model,
            price: car.price,
            color: car.color,
            kmsDriven: car.kmsDriven
        });
    };

    const cancelEditing = () => {
        setEditingCar(null);
        setFormData({
            make: "",
            model: "",
            price: 0,
            color: "",
            kmsDriven: 0
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" || name === "kmsDriven" ? parseFloat(value) || 0 : value
        });
    };

    const handleNewCarInputChange = (e) => {
        const { name, value } = e.target;
        setNewCarData({
            ...newCarData,
            [name]: name === "price" || name === "kmsDriven" ? parseFloat(value) || 0 : value
        });
    };

    const updateCar = async (carId) => {
        setIsUpdating(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('make', formData.make);
            formData.append('model', formData.model);
            formData.append('price', formData.price);
            formData.append('color', formData.color);
            formData.append('userId', currentUserId);
            formData.append('kmsDriven', formData.kmsDriven);

            const response = await fetch(`http://localhost:8000/api/cars/update_car/${carId}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update car");
            }

            const updatedCar = await response.json();
            setCars(prevCars => prevCars.map(car => 
                car._id === carId ? updatedCar : car
            ));
            setSuccessMessage("Car updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            cancelEditing();
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(""), 5000);
        } finally {
            setIsUpdating(false);
        }
    };

    const addNewCar = async () => {
        try {
            const formData = new FormData();
            formData.append('make', newCarData.make);
            formData.append('model', newCarData.model);
            formData.append('price', newCarData.price);
            formData.append('color', newCarData.color);
            formData.append('userId', currentUserId);
            formData.append('cityId', newCarData.cityId);
            formData.append('kmsDriven', newCarData.kmsDriven);

            const response = await fetch(`http://localhost:8000/api/cars/create_car`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add car");
            }

            const addedCar = await response.json();
            setCars(prevCars => [...prevCars, addedCar]);
            setSuccessMessage("Car added successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

            setNewCarData({
                make: "",
                model: "",
                price: 0,
                color: "",
                cityId: "",
                kmsDriven: 0
            });
            setAddingCar(false);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(""), 5000);
        }
    };

    const deleteCar = async (carId) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        try {
            const response = await fetch(`http://localhost:8000/api/cars/delete_car/${carId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: currentUserId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete car");
            }

            setCars(prevCars => prevCars.filter(car => car._id !== carId));
            setSuccessMessage("Car deleted successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(""), 5000);
        }
    };

    const getCityName = (cityId) => {
        const city = cities.find(c => c.id === cityId);
        return city ? `${city.name} (${city.state?.name || 'Unknown state'})` : cityId;
    };

    return (
        <div className="cars-container">
            <h2 className="cars-title">Car Listings</h2>

            {error && <p className="error-text">{error}</p>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <button 
                className="add-car-btn" 
                onClick={() => setAddingCar(true)}
                disabled={loading}
            >
                {loading ? "Loading..." : "Add New Car"}
            </button>

            {addingCar && (
                <div className="add-car-form">
                    <h4>Add New Car</h4>
                    <div className="form-group">
                        <label>Make:</label>
                        <input 
                            type="text" 
                            name="make" 
                            value={newCarData.make} 
                            onChange={handleNewCarInputChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Model:</label>
                        <input 
                            type="text" 
                            name="model" 
                            value={newCarData.model} 
                            onChange={handleNewCarInputChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input 
                            type="number" 
                            name="price" 
                            value={newCarData.price} 
                            onChange={handleNewCarInputChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Color:</label>
                        <input 
                            type="text" 
                            name="color" 
                            value={newCarData.color} 
                            onChange={handleNewCarInputChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>KMs Driven:</label>
                        <input 
                            type="number" 
                            name="kmsDriven" 
                            value={newCarData.kmsDriven} 
                            onChange={handleNewCarInputChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <select 
                            name="cityId" 
                            value={newCarData.cityId} 
                            onChange={handleNewCarInputChange}
                            required
                            disabled={loading || cities.length === 0}
                        >
                            <option value="">{cities.length === 0 ? "Loading cities..." : "Select a city"}</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                    {city.name} ({city.state?.name || 'Unknown state'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button onClick={addNewCar} disabled={loading}>
                            {loading ? "Processing..." : "Add Car"}
                        </button>
                        <button onClick={() => setAddingCar(false)} disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <p className="loading-text">Loading cars...</p>
            ) : (
                <div className="cars-list">
                    {cars.length === 0 ? (
                        <p className="no-cars-text">No cars listed yet.</p>
                    ) : (
                        cars.map(car => (
                            <div key={car._id} className="car-card">
                                {editingCar && editingCar._id === car._id ? (
                                    <div className="edit-form">
                                        <h4>Edit Car Details</h4>
                                        <div className="form-group">
                                            <label>Make:</label>
                                            <input 
                                                type="text" 
                                                name="make" 
                                                value={formData.make} 
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Model:</label>
                                            <input 
                                                type="text" 
                                                name="model" 
                                                value={formData.model} 
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Price:</label>
                                            <input 
                                                type="number" 
                                                name="price" 
                                                value={formData.price} 
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Color:</label>
                                            <input 
                                                type="text" 
                                                name="color" 
                                                value={formData.color} 
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>KMs Driven:</label>
                                            <input 
                                                type="number" 
                                                name="kmsDriven" 
                                                value={formData.kmsDriven} 
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button onClick={() => updateCar(car._id)} disabled={isUpdating}>
                                                {isUpdating ? "Saving..." : "Save"}
                                            </button>
                                            <button onClick={cancelEditing} disabled={isUpdating}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="car-details">
                                            <h4>{car.make} {car.model}</h4>
                                            <p><strong>Price:</strong> ${car.price}</p>
                                            <p><strong>Color:</strong> {car.color}</p>
                                            <p><strong>KMs Driven:</strong> {car.kmsDriven}</p>
                                            {car.cityId && (
                                                <p><strong>City:</strong> {getCityName(car.cityId)}</p>
                                            )}
                                        </div>
                                        <div className="car-actions">
                                            <button 
                                                className="edit-btn" 
                                                onClick={() => startEditing(car)}
                                                disabled={isUpdating}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => deleteCar(car._id)}
                                                disabled={isUpdating}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CarManagement;