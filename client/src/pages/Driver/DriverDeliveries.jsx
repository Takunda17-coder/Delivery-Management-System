import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const STATUS_LABELS = {
  Scheduled: "Scheduled",
  "On Route": "On Route",
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

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading deliveries...</p>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 className="text-2xl font-semibold">My Deliveries</h1>
        <button
          onClick={() => logout(navigate)}
          className="bg-gray-100 text-gray-900 hover:bg-gray-400 px-3 py-1 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="flex justify-end mb-3 py-4 px-6">
        <Link
          to="/driver/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          View Dashboard
        </Link>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      {deliveries.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-gray-600">
          No deliveries assigned.
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm border-collapse px-6 py-4">
            <thead className="border-b-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">Delivery ID</th>
                <th className="p-3 text-left">Pickup</th>
                <th className="p-3 text-left">Dropoff</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.delivery_id} className="border-b-gray-100 border-b hover:bg-gray-50">
                  <td className="p-3">{d.delivery_id}</td>
                  <td className="p-3">{d.pickup_address}</td>
                  <td className="p-3">{d.dropoff_address}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        d.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : d.status === "On Route"
                          ? "bg-yellow-100 text-yellow-800"
                          : d.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : d.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_LABELS[d.status] || d.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(d.delivery_date).toLocaleString()}
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">

                    {(d.status === "Scheduled") && (
                      <button
                        disabled={updatingId === d.delivery_id}
                        onClick={() => updateStatus(d.delivery_id, "On Route")}
                        className="px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs disabled:opacity-50"
                      >
                        Start Delivery
                      </button>
                    )}

                    {d.status === "On Route" && (
                      <>
                        <button
                          disabled={updatingId === d.delivery_id}
                          onClick={() => updateStatus(d.delivery_id, "Completed")}
                          className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs disabled:opacity-50"
                        >
                          Delivered
                        </button>
                        <button
                          disabled={updatingId === d.delivery_id}
                          onClick={() => updateStatus(d.delivery_id, "Cancelled")}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {d.status === "Cancelled" && (
                      <>
                        <button
                          disabled={updatingId === d.delivery_id}
                          onClick={() => updateStatus(d.delivery_id, "Scheduled")}
                          className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs disabled:opacity-50"
                        >
                          Reschedule
                        </button>

                        <button
                          disabled={updatingId === d.delivery_id}
                          onClick={() => updateStatus(d.delivery_id, "On Route")}
                          className="px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs disabled:opacity-50"
                        >
                          Retry Delivery
                        </button>
                      </>
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
