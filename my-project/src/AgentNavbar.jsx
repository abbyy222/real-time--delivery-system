
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AgentNavbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const AgentName = localStorage.getItem("AgentName"); // Retrieve agent name

  useEffect(() => {
    if (!AgentName) {
        console.warn("No AgentName found in localStorage");
        return; // Stop the effect from running if AgentName is null
      }
    const fetchUnreadOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/agent-pending-orders/${AgentName}`);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread orders:", error);
      }
    };

    fetchUnreadOrders();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchUnreadOrders, 10000);
    return () => clearInterval(interval);
  }, [AgentName]);

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-bold">Agent Dashboard</h1>
      <div className="relative">
        <Link to="/AgentOrders" className="text-white text-xl">
          📨 {/* Message Icon */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default AgentNavbar;