import { useEffect } from "react";
import { useCRUD } from "../../hooks/useCRUD";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

export default function ManageInvoices() {
  const { data, form, setForm, handleSubmit, handleEdit, handleDelete, loading } = useCRUD("invoice");

  // Auto-fill fields based on delivery_id
  useEffect(() => {
    const fetchDelivery = async () => {
      if (!form.delivery_id) return;

      try {
        const res = await axios.get(`https://delivery-management-system-backend-2385.onrender.com/api/delivery/${form.delivery_id}`);
        const delivery = res.data;

        if (delivery) {
          setForm((prev) => ({
            ...prev,
            order_id: delivery.order_id || prev.order_id,
            driver_id: delivery.driver_id || prev.driver_id,
            vehicle_id: delivery.vehicle_id || prev.vehicle_id,
            quantity: delivery.quantity || prev.quantity,
            price: delivery.price || prev.price,
            delivery_fee: delivery.delivery_fee || prev.delivery_fee,
            total:
              delivery.total || 
              (delivery.quantity && delivery.price ? delivery.quantity * delivery.price : prev.total),

            // Customer ID may need manual entry if not in delivery
            customer_id: delivery.customer_id || prev.customer_id,
          }));
        }
      } catch (err) {
        console.error("❌ Fetch delivery error:", err);
      }
    };

    fetchDelivery();
  }, [form.delivery_id]);

  return (
    <AdminLayout>
      <div className="p-2">
        <h1 className="text-3xl text-gray-900 font-bold mb-6">Manage Invoices</h1>

        {/* Invoice Form */}
        <form onSubmit={handleSubmit} className="bg-white text-gray-900 p-6 rounded-lg shadow-md space-y-4">
          {/* Delivery ID */}
          <div>
            <label className="block font-semibold mb-1">Delivery ID</label>
            <input
              type="number"
              placeholder="Enter Delivery ID"
              value={form.delivery_id || ""}
              onChange={(e) => setForm({ ...form, delivery_id: e.target.value })}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Auto-filled fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Order ID</label>
              <input type="number" value={form.order_id || ""} className="border p-3 rounded w-full bg-gray-100" readOnly />
            </div>
            <div>
              <label className="block font-semibold mb-1">Customer ID</label>
              <input
                type="number"
                value={form.customer_id || ""}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Driver ID</label>
              <input type="number" value={form.driver_id || ""} className="border p-3 rounded w-full bg-gray-100" readOnly />
            </div>
            <div>
              <label className="block font-semibold mb-1">Vehicle ID</label>
              <input type="number" value={form.vehicle_id || ""} className="border p-3 rounded w-full bg-gray-100" readOnly />
            </div>
            <div>
              <label className="block font-semibold mb-1">Quantity</label>
              <input
                type="number"
                value={form.quantity || ""}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Price</label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Delivery Fee</label>
              <input
                type="number"
                value={form.delivery_fee || ""}
                onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })}
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Total</label>
              <input type="number" value={form.total || ""} className="border p-3 rounded w-full bg-gray-100" readOnly />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <label className="block font-semibold mb-1">Order Items</label>
            <input
              type="text"
              value={form.order_items || ""}
              onChange={(e) => setForm({ ...form, order_items: e.target.value })}
              className="border p-3 rounded w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              value={form.status || "Unpaid"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-3 rounded w-full"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <button type="submit" className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition">
            Save Invoice
          </button>
        </form>

        {/* Invoice Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white text-gray-900 rounded-lg shadow-md divide-y divide-gray-200">
            <thead className="bg-gray-900 text-gray-200 border-b-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Invoice ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Delivery ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Driver ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vehicle ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Issue Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-b-gray-100 border-b">
              {data.map((i) => (
                <tr key={i.invoice_id || i.id}>
                  <td className="px-6 py-4 text-sm">{i.invoice_id}</td>
                  <td className="px-6 py-4 text-sm">{i.delivery_id}</td>
                  <td className="px-6 py-4 text-sm">{i.order_id}</td>
                  <td className="px-6 py-4 text-sm">{i.customer_id}</td>
                  <td className="px-6 py-4 text-sm">{i.driver_id}</td>
                  <td className="px-6 py-4 text-sm">{i.vehicle_id}</td>
                  <td className="px-6 py-4 text-sm">{i.total}</td>
                  <td className="px-6 py-4 text-sm">{i.status}</td>
                  <td className="px-6 py-4 text-sm">{new Date(i.issue_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button onClick={() => handleEdit(i)} className="text-yellow-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(i.invoice_id || i.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
