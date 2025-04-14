import React from "react";
import "../../App.css"; // Adjust path as needed based on your folder structure

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Dashboard Overview */}
            <div className="dashboard">
                <h1 className="dashboard-title">Dashboard Overview</h1>
                <div className="dashboard-stats">
                    <div className="stat-box">
                        <p><span>784</span> Apartments Available</p>
                    </div>
                    <div className="stat-box">
                        <p><span>3,854</span> Satisfied Clients</p>
                    </div>
                    <div className="stat-box">
                        <p><span>24</span> Dedicated Employees</p>
                    </div>
                    <div className="stat-box">
                        <p><span>14</span> Industry Awards</p>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="about" id="about">
                <div className="company">
                    <h2 className="heading">Our Company’s Achievements</h2>
                    <p>
                        Welcome to our real estate company! We are dedicated to providing
                        the best properties and services to our clients. With years of
                        experience in the industry, we have built a strong reputation for
                        trust, quality, and customer satisfaction.
                    </p>
                    <br />
                    <p>
                        Our mission is to help individuals and families find their dream homes.
                        We take pride in offering a wide range of modern apartments, excellent
                        customer service, and a team of professionals ready to assist you at
                        every step of your journey.
                    </p>
                </div>
            </div>
        </div>
    );
}
