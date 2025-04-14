import { useEffect, useState } from "react";
import "../css/Agents.css";

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/api/agents/agents")  // API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch agents.");
                }
                return response.json();
            })
            .then(data => {
                setAgents(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="agents-container">
            <h2 className="agents-title">Real Estate Agents</h2>

            {loading && <p className="loading-text">Loading agents...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && agents.length === 0 && (
                <p className="no-agents-text">No agents found.</p>
            )}

            <ul className="agents-list">
                {agents.map(agent => (
                    <li key={agent.id} className="agent-card">
                        <h3>{agent.agentName || "N/A"}</h3>
                        <p className="agent-details"><strong>Agency:</strong> {agent.agencyName || "N/A"}</p>
                        <p className="agent-details"><strong>Experience:</strong> {agent.experience || "N/A"} years</p>
                        <p className="agent-details"><strong>Contact:</strong> {agent.contactNo || "N/A"}</p>
                        <p className="agent-details"><strong>Email:</strong> {agent.email || "N/A"}</p>
                        <p className="agent-details"><strong>City:</strong> {agent.city?.name || "N/A"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Agents;