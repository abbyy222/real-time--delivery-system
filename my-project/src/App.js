import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import AgentDashboard from "./agent-dashboard";
import AgentPage from "./AgentPage";
import AgentOrders from "./AgentOrders";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", { username, Password });

      // Store user details
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      if (response.data.role === "Admin") {
        navigate("/dashboard");
      } else if (response.data.role === "agent") {
        // ✅ Store AgentName in localStorage
        localStorage.setItem("AgentName", response.data.username);  
        navigate("/agent-dashboard");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password" // ✅ Fixed the casing here (should be lowercase "password")
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg mb-4"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/AgentPage" element={<AgentPage />} />
        <Route path="/AgentOrders" element={<AgentOrders />} />
      </Routes>
    </Router>
  );
};

export default App;
