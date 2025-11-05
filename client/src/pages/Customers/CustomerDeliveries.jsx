import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

const STATUS_LABELS = {
  pending: "Pending",
  scheduled: "Scheduled",
  on_route: "On Route",
  delivered: "Delivered",
  failed: "Failed",
};

export default function CustomerDeliveries() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const customerId = user?.id || user?.user_id;

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/deliveries/customer?customer_id=${customerId}`);
        setDeliveries(res.data || []);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [customerId]);

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading deliveries...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Deliveries</h1>
      {deliveries.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center">
          No deliveries yet.
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Delivery ID</th>
                <th className="p-3 text-left">Order Item</th>
                <th className="p-3 text-left">Pickup</th>
                <th className="p-3 text-left">Dropoff</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(d => (
                <tr key={d.delivery_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{d.delivery_id}</td>
                  <td className="p-3">{d?.Order?.order_item || "-"}</td>
                  <td className="p-3">{d.pickup_address}</td>
                  <td className="p-3">{d.dropoff_address}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        d.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : d.status === "on_route"
                          ? "bg-yellow-100 text-yellow-800"
                          : d.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : d.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_LABELS[d.status] || d.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(d.delivery_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
