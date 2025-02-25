import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";


const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    unassignedOrders: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get("http://localhost:5001/dashboard-metrics");
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-500">
    <Navbar/>
    <div className="p-6 grid gap-4 grid-cols-2 sm:grid-cols-4">
      <div className="bg-blue-500 text-white p-4 rounded-lg transform hover:scale-105 transition">
        <h2>Total Orders</h2>
        <p className="text-2xl font-bold">{metrics.totalOrders}</p>
      </div>
      <div className="bg-yellow-500 text-white p-4 rounded-lg transform hover:scale-105 transition">
        <h2>Pending Deliveries</h2>
        <p className="text-2xl font-bold">{metrics.pendingOrders}</p>
      </div>
      <div className="bg-green-500 text-white p-4 rounded-lg transform hover:scale-105 transition">
        <h2>Completed Deliveries</h2>
        <p className="text-2xl font-bold">{metrics.deliveredOrders}</p>
      </div>
      <div className="bg-red-500 text-white p-4 rounded-lg transform hover:scale-105 transition">
        <h2>Unassigned Orders</h2>
        <p className="text-2xl font-bold">{metrics.unassignedOrders}</p>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;