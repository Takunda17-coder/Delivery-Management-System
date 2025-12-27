import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import CustomerLayout from "../../components/CustomerLayout";
import { Modal, FormInput, Badge } from "../../components/ui";
import { Edit, Trash2 } from "lucide-react"; // Icons for actions

export default function Orders() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); // Track if editing
  const [form, setForm] = useState({
    order_id: null,
    order_item: "",
    quantity: 1,
    weight: "",
    pickup_address: "",
    dropoff_address: "", // ✅ Added Dropoff
    recipient_contact: "", // Added Recipient Contact
  });

  const handleLogout = () => logout(navigate);

  const fetchOrders = async () => {
    try {
      const customerRes = await api.get(`/customers/user/${user.user_id}`);
      const customer = customerRes.data;
      if (!customer.customer_id) return;

      const response = await api.get(`/orders?customer_id=${customer.customer_id}`);
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  // Handle Open Modal (Create or Edit)
  const openModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setForm({
        order_id: order.order_id,
        order_item: order.order_item,
        quantity: order.quantity,
        weight: order.weight,
        pickup_address: order.pickup_address,
        dropoff_address: order.dropoff_address || "",
        recipient_contact: order.recipient_contact || "",
      });
    } else {
      setEditingOrder(null);
      setForm({
        order_id: null,
        order_item: "",
        quantity: 1,
        weight: "",
        pickup_address: "",
        dropoff_address: "",
        recipient_contact: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const customerRes = await api.get(`/customers/user/${user.user_id}`);
      const customerId = customerRes.data.customer_id;

      if (editingOrder) {
        // ✅ UPDATE ORDER
        await api.put(`/orders/${editingOrder.order_id}`, {
          ...form,
          price: editingOrder.price, // Keep existing price
          total: editingOrder.total, // Keep existing total
        });
      } else {
        // ✅ CREATE ORDER
        await api.post("/orders", {
          customer_id: customerId,
          ...form,
          price: 0,
          total: 0,
          status: "Pending",
        });
      }

      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error("Failed to save order:", err);
      alert("Failed to save order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading orders...</p>;
  }

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <button
            onClick={() => openModal()}
            className="bg-deep-orange text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium flex items-center gap-2"
          >
            <span>+</span> Create New Order
          </button>
        </div>

        {/* Orders table */}
        {orders.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-8 text-center text-gray-500">
            You have no orders yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-left">Order ID</th>
                    <th className="py-4 px-6 text-left">Item</th>
                    <th className="py-4 px-6 text-left">Qty</th>
                    <th className="py-4 px-6 text-left">Price</th>
                    <th className="py-4 px-6 text-left">Pickup / Dropoff</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {orders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">#{order.order_id}</td>
                      <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{order.order_item}</td>
                      <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{order.quantity}</td>
                      <td className="py-4 px-6 font-medium text-gray-900 border-y border-gray-100">
                        {Number(order.price) === 0 ? <span className="text-orange-500 text-xs font-bold">QUOTE PENDING</span> : `$${order.total}`}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500 border-y border-gray-100">
                        <div><span className="font-semibold">P:</span> {order.pickup_address}</div>
                        <div><span className="font-semibold">D:</span> {order.dropoff_address || "N/A"}</div>
                      </td>
                      <td className="py-4 px-6 border-y border-gray-100">
                        <Badge status={order.status} label={order.status} />
                      </td>
                      <td className="py-4 px-6 text-gray-600 border-y border-gray-100">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                        {order.status === 'Pending' ? (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openModal(order)} className="text-blue-500 hover:text-blue-700" title="Edit">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleCancelOrder(order.order_id)} className="text-red-500 hover:text-red-700" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Order Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingOrder ? "Edit Order" : "Create New Order"}
          footer={
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="px-4 py-2 bg-deep-orange text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : (editingOrder ? "Update Order" : "Submit Order")}
              </button>
            </div>
          }
        >
          <form className="space-y-4 text-black">
            <FormInput
              label="Item Description"
              value={form.order_item}
              onChange={(e) => setForm({ ...form, order_item: e.target.value })}
              placeholder="e.g. 10 Boxes of Electronics"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
              <FormInput
                label="Weight (kg)"
                type="number"
                min="0"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="0.0"
                required
              />
            </div>
            <FormInput
              label="Pickup Address"
              value={form.pickup_address}
              onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              placeholder="Full pickup address"
              required
            />
            <FormInput
              label="Destination Address"
              value={form.dropoff_address}
              onChange={(e) => setForm({ ...form, dropoff_address: e.target.value })}
              placeholder="Full destination address"
              required
            />
            <FormInput
              label="Recipient Phone Number"
              value={form.recipient_contact}
              onChange={(e) => setForm({ ...form, recipient_contact: e.target.value })}
              placeholder="Contact number for recipient"
              required
            />
            <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">
              ℹ️ {editingOrder ? "Editing this order will require re-approval." : "After you submit, an admin will review your order and send a price quote."}
            </div>
          </form>
        </Modal>
      </div>
    </CustomerLayout>
  );
}
