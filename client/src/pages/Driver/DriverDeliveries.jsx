import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function DriverDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const driverId = localStorage.getItem("driver_id");
        if (!driverId) {
          navigate("/login");
          return;
        }

        const res = await api.get(`/deliveries/driver?driver_id=${driverId}`);
        setDeliveries(res.data || []);
      } catch (err) {
        console.error("Failed to fetch deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading deliveries...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">My Deliveries</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="p-6">
        <table className="w-full text-sm border-collapse bg-white shadow rounded">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-2 text-left">Delivery ID</th>
              <th className="py-2 px-2 text-left">Pickup</th>
              <th className="py-2 px-2 text-left">Dropoff</th>
              <th className="py-2 px-2 text-left">Status</th>
              <th className="py-2 px-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No deliveries assigned.
                </td>
              </tr>
            ) : (
              deliveries.map(delivery => (
                <tr key={delivery.delivery_id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{delivery.delivery_id}</td>
                  <td className="py-2 px-2">{delivery.pickup_address}</td>
                  <td className="py-2 px-2">{delivery.dropoff_address}</td>
                  <td className={`py-2 px-2 font-semibold ${
                    delivery.status === "completed" ? "text-green-600" :
                    delivery.status === "on_route" ? "text-yellow-600" :
                    "text-gray-600"
                  }`}>{delivery.status}</td>
                  <td className="py-2 px-2">{new Date(delivery.delivery_date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
