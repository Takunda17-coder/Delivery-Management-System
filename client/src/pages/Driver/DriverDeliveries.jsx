import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import DriverLayout from "../../components/DriverLayout";

const STATUS_LABELS = {
  Scheduled: "Scheduled",
  "On Route": "On Route",
  "Pending Confirmation": "Pending Confirmation",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export default function DriverDeliveries() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user || user.role !== "driver") {
        navigate("/login");
        return;
      }

      setLoading(true);

      try {
        // ✅ Fetch the driver profile using correct endpoint
        const driverRes = await api.get(`/drivers/user/${user.user_id}`);
        const driver = driverRes.data;
        const driverId = driver.driver_id;

        if (!driverId) {
          setError("Driver ID not found. Contact admin.");
          setLoading(false);
          return;
        }

        // ✅ Fetch all deliveries assigned to this driver
        const deliveriesRes = await api.get(`/delivery/driver?driver_id=${driverId}`);
        setDeliveries(deliveriesRes.data || []);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
        setError(err.response?.data?.message || "Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [user, navigate, location.key]);

  const updateStatus = async (deliveryId, newStatus) => {
    const ok = window.confirm(`Change status to "${STATUS_LABELS[newStatus]}"?`);
    if (!ok) return;

    setUpdatingId(deliveryId);
    setError("");
    setMessage("");

    try {
      const res = await api.put(`/delivery/${deliveryId}`, { status: newStatus });

      setDeliveries((prev) =>
        prev.map((d) =>
          d.delivery_id === deliveryId ? { ...d, status: newStatus } : d
        )
      );

      setMessage(res.data?.message || "Status updated");
    } catch (err) {
      console.error("Status update failed:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending Confirmation":
        return "bg-purple-100 text-purple-800";
      case "On Route":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading deliveries...</p>
    );

  return (
    <DriverLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">My Deliveries</h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">{message}</div>}

        {/* Deliveries List */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          {deliveries.length === 0 ? (
            <p className="text-gray-500 p-8 text-center italic">
              No deliveries assigned.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-0">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-left">ID</th>
                    <th className="py-4 px-6 text-left">Order</th>
                    <th className="py-4 px-6 text-left">Pickup</th>
                    <th className="py-4 px-6 text-left">Dropoff</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deliveries.map((d) => (
                    <tr
                      key={d.delivery_id}
                      className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        #{d.delivery_id}
                      </td>
                      <td className="py-4 px-6 text-gray-600">#{d.order_id}</td>
                      <td
                        className="py-4 px-6 text-gray-600 truncate max-w-[150px]"
                        title={d.pickup_address}
                      >
                        {d.pickup_address}
                      </td>
                      <td
                        className="py-4 px-6 text-gray-600 truncate max-w-[150px]"
                        title={d.dropoff_address}
                      >
                        {d.dropoff_address}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(d.delivery_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                            d.status
                          )}`}
                        >
                          {d.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col gap-2">
                          {d.status !== "Completed" && d.status !== "Cancelled" && (
                            <select
                              className="border p-2 rounded-lg text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-deep-orange outline-none transition cursor-pointer"
                              value={d.status}
                              onChange={(e) =>
                                updateStatus(d.delivery_id, e.target.value)
                              }
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="On Route">On Route</option>
                              <option value="Pending Confirmation">Arrived / Delivered (Request Confirmation)</option>
                              {/* Drivers cannot manually select Completed anymore, Customer must confirm */}
                              {d.status === 'Completed' && <option value="Completed">Completed</option>}
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}

                          <button
                            onClick={() => navigate(`/delivery/${d.delivery_id}`)}
                            className="px-3 py-1.5 rounded-lg bg-orange-secondary hover:bg-orange-300 text-black text-xs font-medium shadow-sm transition w-full"
                          >
                            Track
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DriverLayout>
  );
}
