import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend

// Function to log in user and get tokens
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/login/`, { email, password });
        
        // Store tokens in local storage
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data.detail : "Login failed!";
    }
};

// Function to get all users (protected route)
export const getUsers = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Unauthorized! No token found.");
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data.detail : "Error fetching users!";
    }
};