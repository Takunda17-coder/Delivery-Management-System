import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";


export default function ManageDeliveries() {
  const {
    data,
    form = {},
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    loading,
  } = useCRUD("delivery");

  // Format datetime-local value for input
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl text-gray-900 font-bold mb-4">Manage Deliveries</h1>

        {/* Delivery Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-4 text-gray-900 grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
        >
          {/* Order ID */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Order ID</label>
            <input
              type="number"
              value={form.order_id || ""}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Driver ID */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Driver ID</label>
            <input
              type="number"
              value={form.driver_id || ""}
              onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Vehicle ID */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Vehicle ID</label>
            <input
              type="number"
              value={form.vehicle_id || ""}
              onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Pickup Address */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Pickup Address</label>
            <input
              type="text"
              value={form.pickup_address || ""}
              onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Dropoff Address */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Dropoff Address</label>
            <input
              type="text"
              value={form.dropoff_address || ""}
              onChange={(e) => setForm({ ...form, dropoff_address: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Delivery Date */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Delivery Date</label>
            <input
              type="datetime-local"
              value={formatDateForInput(form.delivery_date)}
              onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Expected Time */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Expected Delivery Time</label>
            <input
              type="time"
              value={form.expected_delivery_time || ""}
              onChange={(e) =>
                setForm({ ...form, expected_delivery_time: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Recipient Name */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Recipient Name</label>
            <input
              type="text"
              value={form.recipient_name || ""}
              onChange={(e) =>
                setForm({ ...form, recipient_name: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Recipient Contact */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Recipient Contact</label>
            <input
              type="text"
              value={form.recipient_contact || ""}
              onChange={(e) =>
                setForm({ ...form, recipient_contact: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Delivery Fee */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Delivery Fee</label>
            <input
              type="number"
              value={form.delivery_fee || ""}
              onChange={(e) =>
                setForm({ ...form, delivery_fee: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Total */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Total</label>
            <input
              type="number"
              value={form.total || ""}
              onChange={(e) => setForm({ ...form, total: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>

          {/* Priority */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="font-medium">Priority</label>
            <select
              className="border p-2 rounded"
              value={form.priority || "Low"}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="font-medium">Status</label>
            <select
              className="border p-2 rounded"
              value={form.status || "Scheduled"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="On Route">On Route</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gray-600 text-white px-3 py-2 rounded col-span-2 mt-2"
          >
            {loading ? "Saving..." : "Save Delivery"}
          </button>
        </form>

        {/* Deliveries Table */}
        <table className="w-full rounded-lg shadow-md overflow-x-auto bg-white">
          <thead className="bg-gray-900 text-gray-200">
            <tr>
              <th>Delivery ID</th>
              <th>Order</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Date</th>
              <th>Time</th>
              <th>Recipient</th>
              <th>Fee</th>
              <th>Total</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(data) &&
              data.map((d) => (
                <tr key={d.delivery_id} className="border-b text-black text-center">
                  <td>{d.delivery_id}</td>
                  <td>{d.order_id}</td>
                  <td>{d.driver_id}</td>
                  <td>{d.vehicle_id}</td>
                  <td>{d.pickup_address}</td>
                  <td>{d.dropoff_address}</td>
                  <td>{new Date(d.delivery_date).toLocaleDateString()}</td>
                  <td>{d.expected_delivery_time}</td>
                  <td>{d.recipient_name}</td>
                  <td>{d.delivery_fee}</td>
                  <td>{d.total}</td>
                  <td>{d.priority}</td>
                  <td>{d.status}</td>

                  <td className="flex gap-2 justify-center py-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className="text-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(d.delivery_id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
