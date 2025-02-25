import React from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg py-4 px-6 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">Delivery Management System</div>
        <div className="flex space-x-6">
          <span onClick={() => navigate("/")} className="cursor-pointer hover:text-gray-300">Dashboard</span>
          <span onClick={() => navigate("/create-order")} className="cursor-pointer hover:text-gray-300">Order</span>
          <span onClick={() => navigate("/AgentPage")} className="cursor-pointer hover:text-gray-300">Agents</span>
          <span onClick={() => navigate("/reports")} className="cursor-pointer hover:text-gray-300">Reports</span>
        </div>
        <div className="flex items-center space-x-4">
          <div onClick={() => navigate("/profile")} className="bg-white text-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100">
            Profile
          </div>
        </div>
      </div>
    </nav>
  );
};