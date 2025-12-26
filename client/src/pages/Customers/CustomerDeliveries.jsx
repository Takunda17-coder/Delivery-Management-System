import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

const STATUS_LABELS = {
  Scheduled: "Scheduled",
  "On Route": "On Route",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export default function CustomerDeliveries() {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => logout(navigate);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user?.user_id) return;

      setLoading(true);
      setError("");

      try {
        // 1️⃣ Fetch the customer using user_id
        const customerRes = await api.get(`/customers/user/${user.user_id}`);
        const customer = customerRes.data;
        const customerId = customer.customer_id;

        // 2️⃣ Fetch deliveries using the actual customer_id
        const res = await api.get(`/delivery/customer?customer_id=${customerId}`);
        setDeliveries(res.data || []);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
        setError("Failed to load deliveries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [user]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading deliveries...</p>;

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-900 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">My Deliveries</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-100 text-gray-900 font-semibold hover:bg-gray-300 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 p-6 mb-4">
        <Link
          to={`/customer/dashboard`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          View Dashboard
        </Link>
        <Link
          to={`/customer/orders`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          View Orders
        </Link>
      </div>

      {/* Deliveries Table */}
      {deliveries.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center">
          No deliveries yet.
        </div>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto p-6">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b-gray-300 border-b hover:bg-gray-50">
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
              {deliveries.map((d) => (
                <tr key={d.delivery_id} className="border-b-gray-300 border-b hover:bg-gray-50">
                  <td className="p-3">{d.delivery_id}</td>
                  <td className="p-3">{d?.Order?.order_item || "-"}</td>
                  <td className="p-3">{d.pickup_address}</td>
                  <td className="p-3">{d.dropoff_address}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${d.status === "Completed"
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
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/delivery/${d.delivery_id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Track
                    </button>
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
