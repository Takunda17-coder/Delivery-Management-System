import React from "react";
import { useCRUD } from "../../hooks/useCRUD";
import AdminLayout from "../../components/AdminLayout";

const ManageOrders = () => {
  const defaultForm = {
    customer_id: "",
    order_item: "",
    quantity: 0,
    price: 0,
    pickup_address: "",
    total: 0,
    weight: 0,
    status: "pending",
  };

  const {
    data: orders,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    loading,
    error,
  } = useCRUD("orders", defaultForm, "order_id");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders.</p>;

  // Helper to update quantity or price and recalc total
  const updateField = (field, value) => {
    const newForm = { ...form, [field]: Number(value) };
    newForm.total = newForm.quantity * newForm.price;
    setForm(newForm);
  };

  return (
    <AdminLayout>
      <div className="p-6 overflow-x-auto">
        <h2 className="text-2xl text-gray-900 font-semibold mb-4">
          Manage Orders
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mb-4 flex text-gray-900 gap-2 flex-wrap"
        >
          <input
            placeholder="Customer ID"
            type="number"
            value={form.customer_id || ""}
            onChange={(e) =>
              setForm({ ...form, customer_id: Number(e.target.value) })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Order Item"
            value={form.order_item || ""}
            onChange={(e) => setForm({ ...form, order_item: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Quantity"
            type="number"
            value={form.quantity || ""}
            onChange={(e) => updateField("quantity", e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price || ""}
            onChange={(e) => updateField("price", e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Pickup Address"
            value={form.pickup_address || ""}
            onChange={(e) =>
              setForm({ ...form, pickup_address: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Total"
            type="number"
            value={form.total || 0}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
          <input
            placeholder="Weight"
            type="number"
            value={form.weight || ""}
            onChange={(e) =>
              setForm({ ...form, weight: Number(e.target.value) })
            }
            className="border p-2 rounded"
          />
          <label className="border p-2 rounded flex items-center">
            Status:
            <select
              value={form.status || "pending"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="ml-2"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <button
            type="submit"
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </form>

        <table className="min-w-full border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-900 text-gray-200">
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
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
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.order_id}
                  className="text-center text-gray-900 hover:bg-gray-50 border-b-1"
                >
                  <td>{o.order_id}</td>
                  <td>{o.customer_id}</td>
                  <td>{o.order_item}</td>
                  <td>{o.quantity}</td>
                  <td>{o.price}</td>
                  <td>{o.pickup_address}</td>
                  <td>{o.total}</td>
                  <td>{o.weight}</td>
                  <td>{o.status}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(o)}
                      className="text-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(o.order_id)}
                      className="text-red-600"
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
};

export default ManageOrders;
