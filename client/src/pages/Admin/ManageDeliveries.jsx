import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";
import { useNavigate } from "react-router-dom";


export default function ManageDeliveries() {
  const navigate = useNavigate();
  const defaultDeliveryForm = {
    order_id: "",
    driver_id: "",
    vehicle_id: "",
    pickup_address: "",
    dropoff_address: "",
    delivery_date: "",
    expected_delivery_time: "",
    delivery_fee: "",
    total: "",
    priority: "Low",
    status: "Scheduled",
    recipient_name: "",
    recipient_contact: "",
  };

  const {
    data,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    loading,
  } = useCRUD("delivery", defaultDeliveryForm);

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
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-black"
        >
          {/* Order ID */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Order ID</label>
            <input
              type="number"
              value={form.order_id || ""}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
              required
            />
          </div>

          {/* Priority */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="font-medium">Priority</label>
            <select
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition shadow-sm"
              value={form.status || "Scheduled"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="On Route">On Route</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-deep-orange text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium"
            >
              {loading ? "Saving..." : "Save Delivery"}
            </button>
          </div>
        </form>

        {/* Deliveries Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Order</th>
                <th className="py-4 px-6 text-left">Driver</th>
                <th className="py-4 px-6 text-left">Vehicle</th>
                <th className="py-4 px-6 text-left">Pickup</th>
                <th className="py-4 px-6 text-left">Dropoff</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="space-y-4">
              {Array.isArray(data) &&
                data.map((d) => (
                  <tr
                    key={d.delivery_id}
                    className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">
                      #{d.delivery_id}
                    </td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">#{d.order_id}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{d.driver_id || "-"}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{d.vehicle_id || "-"}</td>
                    <td className="py-4 px-6 text-gray-600 truncate max-w-[150px] border-y border-gray-100" title={d.pickup_address}>
                      {d.pickup_address}
                    </td>
                    <td className="py-4 px-6 text-gray-600 truncate max-w-[150px] border-y border-gray-100" title={d.dropoff_address}>
                      {d.dropoff_address}
                    </td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">
                      {new Date(d.delivery_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 border-y border-gray-100">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${d.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : d.status === "On Route"
                            ? "bg-blue-100 text-blue-700"
                            : d.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/delivery/${d.delivery_id}`)}
                          className="bg-deep-orange text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-orange-700 transition shadow-sm"
                        >
                          Track
                        </button>
                        <button
                          onClick={() => handleEdit(d)}
                          className="text-gray-500 hover:text-deep-orange transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(d.delivery_id)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          Delete
                        </button>
                      </div>
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
