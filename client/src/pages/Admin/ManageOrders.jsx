import React, { useEffect, useState } from "react";
import { useCRUD } from "../../hooks/useCRUD";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";


const ManageOrders = () => {
  const defaultForm = {
    order_id: null,
    customer_id: "",
    order_item: "",
    quantity: 1,
    price: 0,
    total: 0,
    weight: 0.0,
    pickup_address: "",
    status: "Pending", // match backend enum
  };

  const {
    data: orders,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    cancelEdit,
    isEditing,
    loading,
    submitting,
    error,
    message,
    fetchData,
  } = useCRUD("orders", defaultForm, "order_id");

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`https://delivery-management-system-backend-2385.onrender.com/api/orders`);
        if (Array.isArray(res.data)) {
          setCustomers(res.data.filter((c) => c.status === "active" || c.status === undefined));
        } else {
          console.error("Invalid customers response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  // keep total accurate when quantity/price/weight change
  const updateNumberField = (field, value) => {
    // allow decimals
    const parsed = value === "" ? "" : Number(value);
    const newForm = { ...form, [field]: parsed };
    // recalc total when quantity or price changes
    if ((field === "quantity" || field === "price") && newForm.quantity !== "" && newForm.price !== "") {
      newForm.total = Number(newForm.quantity || 0) * Number(newForm.price || 0);
    }
    setForm(newForm);
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 text-black md:grid-cols-2 gap-4">
          {/* Customer */}
          <div>
            <label className="block mb-1 font-medium">Customer</label>
            {isEditing ? (
              // show readonly label when editing (you requested customer not editable when editing)
              <input
                type="text"
                readOnly
                value={
                  customers.find((c) => c.customer_id === form.customer_id)
                    ? `${customers.find((c) => c.customer_id === form.customer_id).first_name} ${customers.find((c) => c.customer_id === form.customer_id).last_name}`
                    : form.customer_id || ""
                }
                className="border p-2 rounded bg-gray-100 w-full"
              />
            ) : (
              <select
                value={form.customer_id || ""}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value ? Number(e.target.value) : "" })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Item */}
          <div>
            <label className="block mb-1 font-medium">Order Item</label>
            <input
              value={form.order_item || ""}
              onChange={(e) => setForm({ ...form, order_item: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.quantity === "" ? "" : form.quantity}
              onChange={(e) => updateNumberField("quantity", e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price === "" ? "" : form.price}
              onChange={(e) => updateNumberField("price", e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Pickup Address (span full width) */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-medium">Pickup Address</label>
            <input
              value={form.pickup_address || ""}
              onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          

          {/* Total */}
          <div>
            <label className="block mb-1 font-medium">Total</label>
            <input type="number" value={form.total || 0} readOnly className="border p-2 rounded bg-gray-100 w-full" />
          </div>

          {/* Weight (decimals allowed) */}
          <div>
            <label className="block mb-1 font-medium">Weight (kg)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.weight === "" ? "" : form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value === "" ? "" : Number(e.target.value) })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Status */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={form.status || "Pending"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex gap-2 justify-end mt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  cancelEdit();
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              {form.order_id ? "Update Order" : "Save Order"}
            </button>
          </div>
        </form>

        {/* messaging */}
        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">Error: {error.message || "An error occurred"}</div>}

        <table className="min-w-full border-b">
          <thead className="bg-gray-900 text-gray-200">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Qty</th>
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
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No orders
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.order_id} className="text-black">
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
                    <button onClick={() => handleEdit(o)} className="text-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(o.order_id)} className="text-red-600">Delete</button>
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
