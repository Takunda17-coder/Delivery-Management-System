import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import CustomerLayout from "../../components/CustomerLayout";

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
    <CustomerLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">My Deliveries</h1>

        {/* Deliveries Table */}
        {deliveries.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-8 text-center text-gray-500">
            No deliveries yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6 text-left">Delivery ID</th>
                  <th className="py-4 px-6 text-left">Order Item</th>
                  <th className="py-4 px-6 text-left">Pickup</th>
                  <th className="py-4 px-6 text-left">Dropoff</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {deliveries.map((d) => (
                  <tr key={d.delivery_id} className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg">
                    <td className="py-4 px-6 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">{d.delivery_id}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{d?.Order?.order_item || "-"}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{d.pickup_address}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{d.dropoff_address}</td>
                    <td className="py-4 px-6 border-y border-gray-100">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${d.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : d.status === "On Route"
                            ? "bg-blue-100 text-blue-800"
                            : d.status === "Scheduled"
                              ? "bg-yellow-100 text-yellow-800"
                              : d.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {STATUS_LABELS[d.status] || d.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">
                      {new Date(d.delivery_date).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                      <button
                        onClick={() => navigate(`/delivery/${d.delivery_id}`)}
                        className="bg-orange-secondary text-black px-4 py-2 rounded-lg shadow-sm hover:bg-orange-300 transition text-sm font-medium"
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
    </CustomerLayout>
  );
}
