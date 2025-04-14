import React from "react";

export default function About() {
	return (
		<div className="about" id="about">
			<div className="company">
				<p className="heading">Vehicle Vault’s Milestones</p>
				<p>
					Welcome to Vehicle Vault — your trusted destination for exploring, comparing,
					and discovering the perfect vehicle. Whether you're a seasoned enthusiast or
					a first-time buyer, we’re committed to delivering accurate vehicle data,
					detailed comparisons, and an unmatched browsing experience.
				</p>
				<br />
				<p>
					Our mission is to simplify the vehicle buying journey for every user.
					We proudly offer a comprehensive catalog of new and used cars, a streamlined
					search experience, and a knowledgeable support team always ready to guide
					you toward the right ride.
				</p>
			</div>

			<div className="stats">
				<div className="apartments">
					<p>
						<span>3,200+</span> <br /> Cars Listed
					</p>
				</div>
				<div className="clients">
					<p>
						<span>12,500+</span>
						<br /> Happy Vehicle Owners
					</p>
				</div>
				<div className="employees">
					<p>
						<span>35</span>
						<br /> Automotive Experts
					</p>
				</div>
				<div className="awards">
					<p>
						<span>18</span>
						<br /> Industry Recognitions
					</p>
				</div>
			</div>
		</div>
	);
}
