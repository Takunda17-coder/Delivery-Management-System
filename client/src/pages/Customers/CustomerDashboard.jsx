import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import CustomerLayout from "../../components/CustomerLayout";

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    myOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    invoices: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => logout(navigate);

  useEffect(() => {
    if (authLoading) return; // Wait for auth check

    if (!user?.user_id) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchCustomerData = async () => {
      try {
        setDataLoading(true);
        setError("");

        // 1️⃣ Fetch customer using logged-in user’s user_id
        const customerRes = await api.get(`/customers/user/${user.user_id}`);
        const customer = customerRes.data;
        const customerId = customer.customer_id; // ✅ Real customer_id

        // 2️⃣ Fetch orders & invoices using customer_id
        const [ordersRes, invoicesRes] = await Promise.all([
          api.get(`/orders?customer_id=${customerId}`),
          api.get(`/invoice/customer/${customerId}`),
        ]);

        const allOrders = ordersRes.data;
        const completed = allOrders.filter(o => o.status === "Completed").length;
        const pending = allOrders.filter(o => o.status === "Pending").length;

        // 3️⃣ Update Stats
        setStats({
          myOrders: allOrders.length,
          completedOrders: completed,
          pendingOrders: pending,
          invoices: invoicesRes.data.length,
        });

        // 4️⃣ Show the 5 most recent orders
        setRecentOrders(allOrders.slice(-5).reverse());

      } catch (err) {
        console.error("Failed to load customer dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchCustomerData();
  }, [user, authLoading, navigate]);

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="p-6 text-center text-lg font-medium">
        Loading dashboard...
      </div>
    );
  }

  // Error state
  if (error) {
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
  }

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Welcome, {user?.first_name || "Customer"}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white p-6 shadow-md rounded-xl text-center border border-gray-100">
              <h2 className="capitalize text-gray-600 font-medium mb-2">{key.replace(/([A-Z])/g, " $1")}</h2>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 p-8 text-center italic">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-0">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-left">Order ID</th>
                    <th className="py-4 px-6 text-left">Item</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map(order => (
                    <tr key={order.order_id} className="hover:bg-orange-50 transition-colors duration-200">
                      <td className="py-4 px-6 font-medium text-gray-900">#{order.order_id}</td>
                      <td className="py-4 px-6 text-gray-600">{order.order_item}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
