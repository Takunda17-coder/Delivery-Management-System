import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

export default function DriverDashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    vehiclesAssigned: 0,
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => logout(navigate);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const driverId = user?.id || localStorage.getItem("driver_id");
        const token = localStorage.getItem("token");

        if (!driverId) {
          alert("Driver not logged in!");
          navigate("/login");
          return;
        }

        const [deliveriesRes, vehiclesRes] = await Promise.all([
          api.get(`/deliveries/driver?driver_id=${driverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/vehicles?driver_id=${driverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allDeliveries = deliveriesRes.data || [];

        const completed = allDeliveries.filter(d => d.status === "completed").length;
        const pending = allDeliveries.filter(d => d.status === "scheduled" || d.status === "on_route").length;

        setStats({
          totalDeliveries: allDeliveries.length,
          completedDeliveries: completed,
          pendingDeliveries: pending,
          vehiclesAssigned: vehiclesRes.data?.length || 0,
        });

        setRecentDeliveries(allDeliveries.slice(-5).reverse());
      } catch (err) {
        console.error("Failed to load driver dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [user, navigate]);


  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">Driver Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Deliveries" value={stats.totalDeliveries} />
          <StatCard title="Completed" value={stats.completedDeliveries} />
          <StatCard title="Pending" value={stats.pendingDeliveries} />
          <StatCard title="Vehicles Assigned" value={stats.vehiclesAssigned} />
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Recent Deliveries</h2>
          {recentDeliveries.length === 0 ? (
            <p className="text-gray-500">No deliveries assigned yet.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="py-2 text-left">Delivery ID</th>
                  <th className="py-2 text-left">Pickup</th>
                  <th className="py-2 text-left">Dropoff</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDeliveries.map(delivery => (
                  <tr key={delivery.delivery_id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{delivery.delivery_id}</td>
                    <td className="py-2">{delivery.pickup_address}</td>
                    <td className="py-2">{delivery.dropoff_address}</td>
                    <td className={`py-2 font-semibold ${
                      delivery.status === "completed" ? "text-green-600" :
                      delivery.status === "on_route" ? "text-yellow-600" : "text-blue-600"
                    }`}>
                      {delivery.status}
                    </td>
                    <td className="py-2">{new Date(delivery.delivery_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 shadow rounded text-center">
      <h2 className="text-gray-600">{title}</h2>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
