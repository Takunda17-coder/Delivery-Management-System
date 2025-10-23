import { useCRUD } from "../../hooks/useCRUD";
import AdminLayout from "../../components/AdminLayout";

export default function ManageDeliveries() {
  const { data, form, setForm, handleSubmit, handleEdit, handleDelete } = useCRUD("delivery");

  return (
    <AdminLayout> 
    <div className="p-4">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Manage Deliveries</h1>

      <form onSubmit={handleSubmit} className="mb-4 text-gray-900 grid grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Order ID"
          value={form.order_id || ""}
          onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Driver ID"
          value={form.driver_id || ""}
          onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Vehicle ID"
          value={form.vehicle_id || ""}
          onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Pickup Address"
          value={form.pickup_address || ""}
          onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Dropoff Address"
          value={form.dropoff_address || ""}
          onChange={(e) => setForm({ ...form, dropoff_address: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="datetime-local"
          placeholder="Delivery Date"
          value={form.delivery_date || ""}
          onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="time"
          placeholder="Expected Delivery Time"
          value={form.expected_delivery_time || ""}
          onChange={(e) => setForm({ ...form, expected_delivery_time: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Recipient Name"
          value={form.recipient_name || ""}
          onChange={(e) => setForm({ ...form, recipient_name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Recipient Contact"
          value={form.recipient_contact || ""}
          onChange={(e) => setForm({ ...form, recipient_contact: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Delivery Fee"
          value={form.delivery_fee || ""}
          onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Total"
          value={form.total || ""}
          onChange={(e) => setForm({ ...form, total: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <button type="submit" className="bg-gray-600 text-white px-3 py-2 rounded col-span-2">
          Save
        </button>
      </form>

      <table className="w-full  rounded shadow">
        <thead className="bg-gray-900 text-gray-200 gap-2">
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.delivery_id} className="border-b text-gray-900 text-center gap-2">
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
              <td>{d.status}</td>
              <td>
                <button onClick={() => handleEdit(d)} className="text-yellow-600 mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(d.delivery_id)} className="text-red-600">
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
