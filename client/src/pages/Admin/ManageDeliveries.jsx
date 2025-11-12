import { useCRUD } from "../../hooks/useCRUD";
import AdminLayout from "../../components/AdminLayout";

export default function ManageDeliveries() {
  const { data, form, setForm, handleSubmit, handleEdit, handleDelete } =
    useCRUD("delivery");

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl text-gray-900 font-bold mb-4">
          Manage Deliveries
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-4 text-gray-900 grid grid-cols-2 gap-4"
        >
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

          <div className="flex flex-col gap-1">
            <label className="font-medium">Pickup Address</label>
            <input
              type="text"
              value={form.pickup_address || ""}
              onChange={(e) =>
                setForm({ ...form, pickup_address: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Dropoff Address</label>
            <input
              type="text"
              value={form.dropoff_address || ""}
              onChange={(e) =>
                setForm({ ...form, dropoff_address: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Delivery Date</label>
            <input
              type="datetime-local"
              value={form.delivery_date || ""}
              onChange={(e) =>
                setForm({ ...form, delivery_date: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

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

          <div className="col-span-2 flex flex-col gap-1">
            <label className="font-medium">Priority</label>
            <select
              className="border p-2 rounded"
              value={form.priority || ""}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="font-medium">Status</label>
            <select
              className="border p-2 rounded"
              value={form.status || ""}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="on_route">On Route</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gray-600 text-white px-3 py-2 rounded col-span-2 mt-2"
          >
            Save
          </button>
        </form>

        <table className="w-full rounded-lg shadow-md overflow-x-auto">
          <thead className="bg-gray-900 text-gray-200 border-b-gray-100">
            <tr>
              <th>Delivery ID</th>
              <th>Order ID</th>
              <th>Driver ID</th>
              <th>Vehicle ID</th>
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
            {data.map((d) => (
              <tr
                key={d.delivery_id}
                className="border-b-gray-100 border-b text-gray-900 text-center gap-1"
              >
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
                <td>
                  <button
                    onClick={() => handleEdit(d)}
                    className="text-yellow-600 mr-2"
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
