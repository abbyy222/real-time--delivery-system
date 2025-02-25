import React from "react";
import AgentNavbar from "./AgentNavbar";
const AgentDashboard =() => {
 return(
    <div className="mi-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <AgentNavbar/>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
            <h1 className="text-3xl font-bold mb-4"> Welcome onboard Agents</h1>
            <p className="text-lg">Manage your assigned deliveries and notification</p>
        </div>
    </div>
 );
};
export default AgentDashboard;