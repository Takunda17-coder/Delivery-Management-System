import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerId = localStorage.getItem("customer_id");
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
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading orders...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center">
          <p className="text-gray-500">You have no orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Item</th>
                <th className="text-left py-3 px-4">Qty</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className="border-b hover:bg-gray-50">
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
                  <td className="py-3 px-4 flex flex-col gap-1">
                    <Link
                      to={`/customer/orders/${order.order_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    {order.delivery_id && (
                      <Link
                        to={`/customer/deliveries/${order.delivery_id}`}
                        className="text-green-600 hover:underline"
                      >
                        Track Delivery
                      </Link>
                    )}

                    {order.status === "Pending" && (
                      <button className="text-red-600 hover:underline">
                        Cancel
                      </button>
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
