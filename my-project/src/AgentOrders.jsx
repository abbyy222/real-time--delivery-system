import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AgentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const agentName = localStorage.getItem("AgentName"); // ✅ Ensure it's defined

  const fetchOrders = useCallback(async () => {
    try {
      if (!agentName) {
        console.error("No Agent Name Found in localStorage");
        return;
      }
      const response = await axios.get(`http://localhost:5001/api/agent-pending-orders/${agentName}`);
      console.log("Fetched Data:", response.data);
      setOrders(response.data.orders || []); // ✅ Handle potential undefined value
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [agentName]); // ✅ Fix useEffect dependency issue

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // ✅ Corrected dependency

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
      <p className="text-lg font-semibold text-red-600">Unread Orders: {unreadCount}</p>

      {orders.length === 0 ? (
        <p>No pending orders</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.OrderID} className="p-4 border rounded-lg shadow-md">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Order-Details(package):</strong> {order.order_details}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => sendNotification(order, order.CustomerEmail)}
              >
                Notify Customer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Function to send email notification
const sendNotification = async (order, CustomerEmail) => {
    console.log("Sending Notification with:", { order, CustomerEmail}); // Debugging
  
    if (!order || !CustomerEmail) {
      console.error("Error: Missing order details or customer email");
      alert("Missing order details or customer email");
      return;
    }
    if (!order.id) { 
      console.error("Order ID is missing in order details:", order);
      return alert("Order ID is missing!");
  }
  
    try {
      await axios.post("http://localhost:5001/send-email", { 
        order_details: order, 
        CustomerEmail
        
      });
      alert("Notification sent to customer!");
    } catch (error) {
      console.error("Error sending notification:", error.response?.data || error.message);
      alert("Failed to send notification");
    }
  };

export default AgentOrders;
