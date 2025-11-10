import React, { useEffect, useState } from "react";
import { useCRUD } from "../../hooks/useCRUD";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";

const ManageOrders = () => {
  const defaultForm = {
    customer_id: "",
    order_item: "",
    quantity: 0,
    price: 0,
    pickup_address: "",
    total: 0,
    weight: 0,
    status: "Pending",
  };

  const { data: orders, form, setForm, handleSubmit, handleEdit, handleDelete, isEditing, loading, error } =
    useCRUD("orders", defaultForm, "order_id");

  const [customers, setCustomers] = useState([]);

  // fetch active customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("https://delivery-management-system-backend-2385.onrender.com/api/customers");
        setCustomers(res.data.filter(c => c.status === "active")); // only active customers
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders.</p>;

  const updateField = (field, value) => {
    const newForm = { ...form, [field]: Number(value) };
    newForm.total = newForm.quantity * newForm.price;
    setForm(newForm);
  };

  return (
    <AdminLayout>
      <div className="p-6 overflow-x-auto">
        <h2 className="text-2xl text-gray-900 font-semibold mb-4">Manage Orders</h2>

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4 text-gray-900">
          <div className="flex flex-col">
            <label className="font-medium">Customer</label>
            {isEditing ? (
              <input type="text" readOnly value={form.customer_name || form.customer_id} className="border p-2 rounded bg-gray-100" />
            ) : (
              <select value={form.customer_id || ""} onChange={(e) => setForm({ ...form, customer_id: Number(e.target.value) })} className="border p-2 rounded">
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Order Item</label>
            <input value={form.order_item || ""} onChange={(e) => setForm({ ...form, order_item: e.target.value })} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Quantity</label>
            <input type="number" value={form.quantity || ""} onChange={(e) => updateField("quantity", e.target.value)} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Price</label>
            <input type="number" value={form.price || ""} onChange={(e) => updateField("price", e.target.value)} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col col-span-2">
            <label className="font-medium">Pickup Address</label>
            <input value={form.pickup_address || ""} onChange={(e) => setForm({ ...form, pickup_address: e.target.value })} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Total</label>
            <input type="number" value={form.total || 0} readOnly className="border p-2 rounded bg-gray-100" />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Weight (kg)</label>
            <input type="number" value={form.weight || ""} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col col-span-2">
            <label className="font-medium">Status</label>
            <select value={form.status || "Pending"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border p-2 rounded">
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end mt-2">
            <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700">
              {form.order_id ? "Update Order" : "Save Order"}
            </button>
          </div>
        </form>

        <table className="min-w-full border-b-gray-100 border-b rounded-lg">
          <thead className="bg-gray-900 text-gray-200 border-b-gray-100 border-b">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Pickup</th>
              <th>Total</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-4">No orders found</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.order_id} className="text-center text-gray-900 border-b-gray-100 border-b hover:bg-gray-50">
                  <td>{o.order_id}</td>
                  <td>{o.customer?.first_name} {o.customer?.last_name}</td>
                  <td>{o.order_item}</td>
                  <td>{o.quantity}</td>
                  <td>{o.price}</td>
                  <td>{o.pickup_address}</td>
                  <td>{o.total}</td>
                  <td>{o.weight}</td>
                  <td>{o.status}</td>
                  <td className="flex gap-2 justify-center">
                    <button type="button" onClick={() => handleEdit(o)} className="text-yellow-600 mr-2">Edit</button>
                    <button onClick={() => handleDelete(o.order_id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
