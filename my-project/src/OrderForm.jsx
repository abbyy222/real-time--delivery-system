import { useState } from "react";
export default function OrderForm({onAddOrder }) {
    const [orderDetails, setrOrderDetails] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!orderDetails.trim()) return;
        onAddOrder(orderDetails);
        setrOrderDetails("");

    }
    return(
        <form onSubmit={handleSubmit} className="bg-primary p-6 rounded-lg shadow-md text-light">
            <h2 className="text-2xl font-bold mb-4 animate-fadeIn">Create a new Order</h2>
            <input type="text" value={orderDetails} onChange={(e) => setrOrderDetails(e.target.value)}
            placeholder="Enter Order Details...." className="w-full p-2 mb-4 rounded text-dark focua: outline-accent"/>
            <button type="submit"className="bg-accent text-light px-4 py-2 "> Add Order
                
            </button>

        </form>
    )
}