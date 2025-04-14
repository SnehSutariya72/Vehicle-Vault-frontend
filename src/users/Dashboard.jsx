import React from "react";
import "../css/Dashboard.css";

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Dashboard Overview */}
            <div className="dashboard">
                <h1 className="dashboard-title">Vehicle Vault Dashboard</h1>
                <div className="dashboard-stats">
                    <div className="stat-box">
                        <p><span>1,243</span> Cars Available</p>
                    </div>
                    <div className="stat-box">
                        <p><span>5,892</span> Happy Customers</p>
                    </div>
                    <div className="stat-box">
                        <p><span>35</span> Expert Dealers</p>
                    </div>
                    <div className="stat-box">
                        <p><span>22</span> Auto Industry Awards</p>
                    </div>
                </div>
            </div>
            
            {/* About Section */}
            <div className="about" id="about">
                <div className="company">
                    <h2 className="heading">Why Choose Vehicle Vault?</h2>
                    <p>
                        Welcome to Vehicle Vault – your ultimate destination for finding the perfect car.
                        Whether you're looking for a budget-friendly ride or a luxury drive, we offer a vast
                        collection of new and pre-owned vehicles across all categories.
                    </p>
                    <br />
                    <p>
                        Our mission is to revolutionize the car-buying experience by combining top-tier customer service,
                        a trusted dealer network, and powerful search tools that make discovering your dream vehicle easier than ever.
                        At Vehicle Vault, you're not just buying a car – you're starting your next journey.
                    </p>
                </div>
            </div>
        </div>
    );
}
