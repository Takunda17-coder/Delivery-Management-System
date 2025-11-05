// src/pages/driver/DriverDeliveries.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const STATUS_LABELS = {
  pending: "Pending",
  on_route: "On route",
  delivered: "Delivered",
  failed: "Failed",
};

export default function DriverDeliveries() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // id being updated
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // get driver id defensively (user object shape differs across code)
  const driverId = user?.user_id || user?.id || user?.userId || user?.driver_id;

  useEffect(() => {
    if (!user || (!driverId && user.role !== "admin")) {
      console.warn("Driver not logged in");
      // if not a driver, redirect to login
      navigate("/login");
      return;
    }

    const fetchDeliveries = async () => {
      setLoading(true);
      setError("");
      try {
        // endpoint: /delivery/driver?driver_id=...
        const res = await api.get(`/delivery/driver?driver_id=${driverId}`);
        setDeliveries(res.data || []);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
        setError(err.response?.data?.message || "Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
    // optionally refetch on location change (e.g. filter query)
  }, [user, driverId, navigate, location.key]);

  const updateStatus = async (deliveryId, newStatus) => {
    if (!["pending", "on_route", "delivered", "failed"].includes(newStatus)) {
      setError("Invalid status");
      return;
    }

    const ok = window.confirm(`Change status to "${STATUS_LABELS[newStatus]}"?`);
    if (!ok) return;

    setUpdatingId(deliveryId);
    setError("");
    setMessage("");

    try {
      // backend expects PUT /delivery/:id
      const res = await api.put(`/delivery/${deliveryId}`, { status: newStatus });

      // optimistic update: update local state
      setDeliveries(prev =>
        prev.map(d => (d.delivery_id === deliveryId ? { ...d, status: newStatus } : d))
      );

      setMessage(res.data?.message || "Status updated");
    } catch (err) {
      console.error("Status update failed:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
      // option: re-fetch to ensure consistency
      try {
        const r = await api.get(`/delivery/driver?driver_id=${driverId}`);
        setDeliveries(r.data || []);
      } catch (e) {
        // ignore
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading deliveries...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My Deliveries</h1>
          <div className="flex gap-2">
            <button
              onClick={() => logout(navigate)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div className="mb-4 text-red-600">{error}</div>}
        {message && <div className="mb-4 text-green-600">{message}</div>}

        {deliveries.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-gray-600">No deliveries assigned.</div>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Delivery ID</th>
                  <th className="p-3 text-left">Order Item</th>
                  <th className="p-3 text-left">Pickup</th>
                  <th className="p-3 text-left">Dropoff</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.delivery_id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{d.delivery_id}</td>
                    <td className="p-3">
                      {/* delivery may include order info via include */}
                      {d?.Order?.order_item || d?.order_item || "—"}
                    </td>
                    <td className="p-3">{d.pickup_address}</td>
                    <td className="p-3">{d.dropoff_address}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded font-semibold text-xs ${
                          d.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : d.status === "on_route"
                            ? "bg-yellow-100 text-yellow-800"
                            : d.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_LABELS[d.status] || d.status}
                      </span>
                    </td>
                    <td className="p-3">{d.delivery_date ? new Date(d.delivery_date).toLocaleString() : "-"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {/* Action buttons — disable the current status button */}
                        <button
                          onClick={() => updateStatus(d.delivery_id, "on_route")}
                          disabled={updatingId === d.delivery_id || d.status === "on_route"}
                          className="px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs disabled:opacity-50"
                        >
                          On route
                        </button>

                        <button
                          onClick={() => updateStatus(d.delivery_id, "delivered")}
                          disabled={updatingId === d.delivery_id || d.status === "delivered"}
                          className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs disabled:opacity-50"
                        >
                          Delivered
                        </button>

                        <button
                          onClick={() => updateStatus(d.delivery_id, "failed")}
                          disabled={updatingId === d.delivery_id || d.status === "failed"}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs disabled:opacity-50"
                        >
                          Failed
                        </button>

                        <button
                          onClick={() => updateStatus(d.delivery_id, "pending")}
                          disabled={updatingId === d.delivery_id || d.status === "pending"}
                          className="px-2 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs disabled:opacity-50"
                        >
                          Mark Pending
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
  );
}
