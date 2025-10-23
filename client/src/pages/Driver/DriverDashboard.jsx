import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function DriverDashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    vehiclesAssigned: 0,
  });

  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const driverId = localStorage.getItem("driver_id"); // stored after login

        const [deliveriesRes, vehiclesRes] = await Promise.all([
          api.get(`/deliveries?driver_id=${driverId}`),
          api.get(`/vehicles?driver_id=${driverId}`),
        ]);

        const allDeliveries = deliveriesRes.data || [];
        const completed = allDeliveries.filter(
          (d) => d.status === "Completed"
        ).length;
        const pending = allDeliveries.filter(
          (d) => d.status === "In Transit" || d.status === "Pending"
        ).length;

        setStats({
          totalDeliveries: allDeliveries.length,
          completedDeliveries: completed,
          pendingDeliveries: pending,
          vehiclesAssigned: vehiclesRes.data.length,
        });

        // Show last 5 deliveries
        setRecentDeliveries(allDeliveries.slice(-5).reverse());
      } catch (err) {
        console.error("Failed to load driver dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white p-4 shadow rounded text-center">
            <h2 className="capitalize">{key.replace(/([A-Z])/g, " $1")}</h2>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-3">Recent Deliveries</h2>

        {recentDeliveries.length === 0 ? (
          <p className="text-gray-500">No recent deliveries found.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-2 text-left">Delivery ID</th>
                <th className="py-2 text-left">Order ID</th>
                <th className="py-2 text-left">Destination</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.delivery_id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{delivery.delivery_id}</td>
                  <td className="py-2">{delivery.order_id}</td>
                  <td className="py-2">{delivery.destination}</td>
                  <td
                    className={`py-2 font-semibold ${
                      delivery.status === "Completed"
                        ? "text-green-600"
                        : delivery.status === "In Transit"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {delivery.status}
                  </td>
                  <td className="py-2">
                    {new Date(delivery.delivery_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
