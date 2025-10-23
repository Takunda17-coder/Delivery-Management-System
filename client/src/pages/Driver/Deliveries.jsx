import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        // get logged-in driver ID from localStorage (set during login)
        const driverId = localStorage.getItem("driver_id");

        const response = await api.get(`/deliveries?driver_id=${driverId}`);
        setDeliveries(response.data);
      } catch (err) {
        console.error("Failed to fetch deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading deliveries...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Deliveries</h1>

      {deliveries.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center">
          <p className="text-gray-500">No deliveries assigned yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left py-3 px-4">Delivery ID</th>
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Destination</th>
                <th className="text-left py-3 px-4">Vehicle</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Delivery Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.delivery_id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{delivery.delivery_id}</td>
                  <td className="py-3 px-4">{delivery.order_id}</td>
                  <td className="py-3 px-4">{delivery.customer_name}</td>
                  <td className="py-3 px-4">{delivery.destination}</td>
                  <td className="py-3 px-4">{delivery.vehicle_number}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        delivery.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : delivery.status === "In Transit"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(delivery.delivery_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {delivery.status !== "Completed" && (
                      <button
                        onClick={() => markAsDelivered(delivery.delivery_id)}
                        className="text-blue-600 hover:underline"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    <button className="text-gray-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // mark a delivery as completed
  async function markAsDelivered(id) {
    try {
      await api.put(`/deliveries/${id}`, { status: "Completed" });
      setDeliveries((prev) =>
        prev.map((d) =>
          d.delivery_id === id ? { ...d, status: "Completed" } : d
        )
      );
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    }
  }
}
