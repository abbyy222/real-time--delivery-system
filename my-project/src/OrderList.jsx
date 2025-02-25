export default function OrderList({orders}) {
    return(
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-dark">Order List</h2>
            <ul className="mt-4">
                {orders.map((order, index) => 
                (
                    <li key={index} className="bg-light p-3 mb-2 rounded-lg shadow-sm">{order}</li>
                ))}
            </ul>
        </div>
    );
}