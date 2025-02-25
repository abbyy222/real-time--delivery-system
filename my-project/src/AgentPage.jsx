import React, { useEffect, useState } from "react";
import axios from "axios";

const AgentPage = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchAgents();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/pending-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching Orders", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/agents");
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents", error);
    }
  };

  const handleAssignAgent = async (orderId) => {
    try {
      await axios.post("http://localhost:5001/api/assign-agent", {
        orderId,
        AgentName: selectedAgentId,
      });
      alert("Agent Assigned successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error Assigning agent", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-gradient">
      <h1 className="text-3xl font-bold text-white mb-6">Pending Orders</h1>

      <div className="w-full max-w-3xl space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105"
          >
            <p className="text-white"><strong>Order ID:</strong> {order.id}</p>
            <p className="text-white"><strong>Customer:</strong> {order.customer_name}</p>
            <p className="text-white"><strong>Status:</strong> {order.status}</p>
            
            <button
              className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedOrderId(order.id)}
            >
              Assign Agent
            </button>

            {selectedOrderId === order.id && (
              <div className="mt-4">
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full p-2 border-none rounded-md focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.AgentID} value={agent.AgentName}>
                      {agent.AgentName}
                    </option>
                  ))}
                </select>

                <button
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md transition-all duration-300 hover:scale-105"
                  onClick={() => handleAssignAgent(order.id)}
                >
                  Proceed
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentPage;