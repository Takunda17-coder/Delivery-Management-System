// src/pages/admin/ManageOrders.jsx
import React, { useEffect, useState } from "react";
import { useCRUD } from "../../hooks/useCRUD";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";

const API = "https://delivery-management-system-backend-2385.onrender.com/api";

export default function ManageOrders() {
  const defaultForm = {
    order_id: null,
    customer_id: "",
    order_item: "",
    quantity: 1,
    price: 0,
    total: 0,
    weight: "", // allow fractional input
    pickup_address: "",
    status: "pending",
  };

  const {
    data: orders,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    isEditing,
    setIsEditing,
    loading,
    error,
    refresh,
  } = useCRUD("orders", defaultForm, "order_id");

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${API}/customers`);
        if (Array.isArray(res.data)) {
          setCustomers(res.data.filter((c) => c.status === "active"));
        } else {
          console.error("Invalid customers payload", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch customers", err);
        toast.error("Failed to load customers");
      }
    };
    fetchCustomers();
  }, []);

  // Recalculate total whenever quantity or price changes
  useEffect(() => {
    const q = Number(form.quantity) || 0;
    const p = parseFloat(form.price) || 0;
    setForm((prev) => ({ ...prev, total: Number((q * p).toFixed(2)) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.quantity, form.price]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders.</p>;

  const onEdit = (o) => {
    handleEdit(o);
    // ensure weight is a string so input remains controlled (allow decimals)
    setForm((prev) => ({
      ...prev,
      weight: prev.weight !== null ? String(prev.weight) : "",
    }));
  };

  // simple front-end validation before submit
  const validate = () => {
    if (!form.customer_id && !isEditing) {
      toast.error("Please select a customer");
      return false;
    }
    if (!form.order_item) {
      toast.error("Order item required");
      return false;
    }
    if (Number(form.quantity) <= 0) {
      toast.error("Quantity must be > 0");
      return false;
    }
    if (Number(form.price) < 0) {
      toast.error("Price must be >= 0");
      return false;
    }
    // weight can be decimal; if provided must be numeric
    if (form.weight !== "" && isNaN(parseFloat(form.weight))) {
      toast.error("Weight must be a number");
      return false;
    }
    return true;
  };

  // Wrap default handleSubmit to validate first
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // ensure numeric conversions that backend expects
    const normalized = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      total: Number(form.total),
      weight: form.weight === "" ? undefined : parseFloat(form.weight),
    };

    // use CRUD's handleSubmit logic manually to pass normalized form
    try {
      const id = normalized.order_id;
      const payload = normalized;
      if (id) {
        await axios.put(`${API}/orders/${id}`, payload);
        toast.success("Order updated");
      } else {
        await axios.post(`${API}/orders`, payload);
        toast.success("Order created");
      }
      setIsEditing(false);
      setForm(defaultForm);
      refresh();
    } catch (err) {
      console.error("Submit error", err);
      toast.error(err.response?.data?.message || "Failed to save order");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

        <form
          onSubmit={onSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900"
        >
          <div>
            <label className="block mb-1 font-medium">Customer</label>
            {isEditing ? (
              // show readonly name when editing (do not allow changing customer)
              <input
                readOnly
                className="border p-2 rounded bg-gray-100 w-full"
                value={
                  (customers.find((c) => c.customer_id === form.customer_id)
                    ?.first_name || "") +
                  " " +
                  (customers.find((c) => c.customer_id === form.customer_id)
                    ?.last_name || "")
                }
              />
            ) : (
              <select
                value={form.customer_id || ""}
                onChange={(e) =>
                  setForm({ ...form, customer_id: Number(e.target.value) })
                }
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name} ({c.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Order Item</label>
            <input
              value={form.order_item || ""}
              onChange={(e) => setForm({ ...form, order_item: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Pickup Address</label>
            <input
              value={form.pickup_address || ""}
              onChange={(e) =>
                setForm({ ...form, pickup_address: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Total</label>
            <input
              type="number"
              readOnly
              value={form.total || 0}
              className="border p-2 rounded bg-gray-100 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              {isEditing ? "Update Order" : "Save Order"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm(defaultForm);
                }}
                className="ml-2 px-4 py-2 border rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <table className="min-w-full border-b">
          <thead className="bg-gray-900 text-gray-200">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Item</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Pickup</th>
              <th className="p-2">Total</th>
              <th className="p-2">Weight</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No orders
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.order_id} className="text-black border-b">
                  <td className="p-2">{o.order_id}</td>
                  <td className="p-2">
                    {o.customer?.first_name} {o.customer?.last_name}
                  </td>
                  <td className="p-2">{o.order_item}</td>
                  <td className="p-2">{o.quantity}</td>
                  <td className="p-2">{o.price}</td>
                  <td className="p-2">{o.pickup_address}</td>
                  <td className="p-2">{o.total}</td>
                  <td className="p-2">{o.weight}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(o)}
                      className="text-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(o.order_id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
