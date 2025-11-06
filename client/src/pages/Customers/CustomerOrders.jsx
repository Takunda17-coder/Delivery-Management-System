import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

export default function Orders() {
  const { user, logout } = useAuth(); // <-- correct object destructuring
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => logout(navigate);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 1️⃣ Fetch customer using logged-in user’s user_id
        const customerRes = await api.get(`/customers/user/${user.user_id}`);
        const customer = customerRes.data;
        const customerId = customer.customer_id; // ✅ Real customer_id
        if (!customerId) return;

        const response = await api.get(`/orders?customer_id=${customerId}`);
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading orders...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav */}
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">My Orders</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-black font-semibold hover:bg-gray-100 px-3 py-1 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="flex gap-4 p-6 mb-4">
        <Link
          to={`/customer/dashboard`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          View Dashboard
        </Link>
        <Link
          to={`/customer/deliveries`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          View Deliveries
        </Link>
      </div>

      {/* Orders table */}

      {orders.length === 0 ? (
        <div className="bg-white  rounded-lg  text-center p-6">
          <p className="text-gray-500">You have no orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg p-6">
          <table className="w-full text-sm bg-white border-b-gray-300 border-b rounded-lg ">
            <thead>
              <tr className=" border-b-gray-300 border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Item</th>
                <th className="text-left py-3 px-4">Qty</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b-gray-300 border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{order.order_id}</td>
                  <td className="py-3 px-4">{order.order_item}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4 font-semibold">${order.total}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
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
