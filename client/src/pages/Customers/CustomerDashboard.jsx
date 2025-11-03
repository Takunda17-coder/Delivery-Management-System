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
    driversAssigned: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => logout(navigate);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        if (!user || !user.id) {
          console.warn("No customer logged in");
          return;
        }

        const customerId = user.id; // ✅ get from auth context

        const [ordersRes, invoicesRes, driversRes] = await Promise.all([
          api.get(`/orders?customer_id=${customerId}`),
          api.get(`/invoices?customer_id=${customerId}`),
          api.get(`/drivers?customer_id=${customerId}`)
        ]);

        const allOrders = ordersRes.data;
        const completed = allOrders.filter(o => o.status === "Completed").length;
        const pending = allOrders.filter(o => o.status === "Pending").length;

        setStats({
          myOrders: allOrders.length,
          completedOrders: completed,
          pendingOrders: pending,
          invoices: invoicesRes.data.length,
          driversAssigned: driversRes.data.length,
        });

        setRecentOrders(allOrders.slice(-5)); // last 5 orders
      } catch (err) {
        console.error("Failed to load customer dashboard data:", err);
      }
    };

    fetchCustomerData();
  }, [user]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-8 flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Customer Dashboard</h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
          >
            Logout
          </button>
        </div>

        {/* Quick Navigation */}
        <div className="flex gap-4 mb-6">
          <Link
            to={`/customer/orders/${user?.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View My Orders
          </Link>

          <Link
            to={`/customer/deliveries/${user?.id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            View Deliveries
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
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
                {recentOrders.map((order) => (
                  <tr key={order.order_id} className="border-b">
                    <td className="py-2">{order.order_id}</td>
                    <td className="py-2">{order.order_item}</td>
                    <td
                      className={`py-2 font-semibold ${
                        order.status === "Completed"
                          ? "text-green-600"
                          : order.status === "Pending"
                          ? "text-yellow-600"
                          : "text-gray-600"
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
