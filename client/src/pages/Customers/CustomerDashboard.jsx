import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

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

        const customerId = user.user_id;

        // Fetch orders and invoices
        const [ordersRes, invoicesRes] = await Promise.all([
          api.get(`/orders?customer_id=${customerId}`),
          api.get(`/invoice/customer/${customerId}`),
        ]);

        const allOrders = ordersRes.data;
        const completed = allOrders.filter(o => o.status === "Completed").length;
        const pending = allOrders.filter(o => o.status === "Pending").length;

        setStats({
          myOrders: allOrders.length,
          completedOrders: completed,
          pendingOrders: pending,
          invoices: invoicesRes.data.length,
        });

        // Show the 5 most recent orders
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
    <div className=" bg-gray-100 min-h-screen">
            
        {/* Header */}
        <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
          <h1 className="text-2xl text-gray-100 font-bold">
            Welcome, {user?.first_name || "Customer"}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-100 text-gray-900 font-semibold hover:bg-gray-300 px-3 py-1 rounded"
          >
            Logout
          </button>
        </nav>

        {/* Quick Links */}
      <div className="container p-4">  
        <div className="flex gap-4 mb-4">
          <Link
            to={`/customer/orders`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View My Orders
          </Link>
          <Link
            to={`/customer/deliveries`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            View Deliveries
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white p-4 shadow rounded text-center">
              <h2 className="capitalize">{key.replace(/([A-Z])/g, " $1")}</h2>
              <p className="text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Order ID</th>
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.order_id} className="border-b">
                    <td className="py-2">{order.order_id}</td>
                    <td className="py-2">{order.order_item}</td>
                    <td
                      className={`py-2 font-semibold ${
                        order.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
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
