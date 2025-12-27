import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { StatCard } from "../../components/ui/index.jsx";
import DriverLayout from "../../components/DriverLayout";

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
  });

  const [recentDeliveries, setRecentDeliveries] = useState([]);

  const handleLogout = () => logout(navigate);

  const goToDeliveries = () => navigate("/driver/deliveries");

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!user || user.role !== "driver") {
        console.warn("Driver not logged in");
        logout(navigate);
        return;
      }

      try {
        // 1️⃣ Get driver using logged-in user's user_id
        const driverRes = await api.get(`/drivers/user/${user.user_id}`);
        const driver = driverRes.data;
        const driverId = driver.driver_id; // ✅ Real driver_id

        if (!driverId) {
          console.warn("No driver ID found in user data");
          navigate("/login");
          return;
        }

        // 2️⃣ Fetch deliveries assigned to this driver
        const deliveriesRes = await api.get(`/delivery/driver?driver_id=${driverId}`);
        const allDeliveries = deliveriesRes.data;

        const completed = allDeliveries.filter((d) => d.status === "Completed").length;
        const pending = allDeliveries.filter((d) => d.status === "Scheduled").length;

        setStats({
          assignedDeliveries: allDeliveries.length,
          completedDeliveries: completed,
          pendingDeliveries: pending,
        });

        setRecentDeliveries(allDeliveries.slice(-5));
      } catch (err) {
        console.error("Failed to load driver dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [user, navigate]);


  if (loading) {
    return (
      <p className="text-center text-gray-600 mt-10">Loading dashboard...</p>
    );
  }

  return (
    <DriverLayout>
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Assigned Deliveries"
            value={stats.assignedDeliveries}
            icon="📦"
            color="blue"
          />
          <StatCard
            title="Completed"
            value={stats.completedDeliveries}
            icon="✅"
            color="green"

          />
          <StatCard
            title="Pending"
            value={stats.pendingDeliveries}
            icon="⏳"
            color="orange"
          />
        </div>

        {/* Button to View All Deliveries */}
        <div className="flex justify-end mb-4">
          <button
            onClick={goToDeliveries}
            className="bg-deep-orange text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-orange-300 transition font-medium"
          >
            View All Deliveries
          </button>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Deliveries</h2>
          </div>

          {recentDeliveries.length === 0 ? (
            <p className="text-gray-500 p-8 text-center italic">No deliveries assigned yet.</p>
          ) : (
            <table className="w-full border-separate border-spacing-y-0">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6 text-left">Delivery ID</th>
                  <th className="py-4 px-6 text-left">Pickup</th>
                  <th className="py-4 px-6 text-left">Dropoff</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentDeliveries.map((delivery) => (
                  <tr
                    key={delivery.delivery_id}
                    className="hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
                    onClick={() =>
                      navigate(`/delivery/${delivery.delivery_id}`) // Standardized route
                    }
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">#{delivery.delivery_id}</td>
                    <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]" title={delivery.pickup_address}>{delivery.pickup_address}</td>
                    <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]" title={delivery.dropoff_address}>{delivery.dropoff_address}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${delivery.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : delivery.status === "On Route"
                            ? "bg-yellow-100 text-yellow-800"
                            : delivery.status === "Scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(delivery.delivery_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DriverLayout>
  );
}
