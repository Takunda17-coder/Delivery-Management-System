import AdminLayout from "../../components/AdminLayout";
import { useCRUD } from "../../hooks/useCRUD";

export default function ManageVehicles() {
  const { data, form, setForm, handleSubmit, handleEdit, handleDelete } =
    useCRUD("vehicles");

  // Ensure form is always defined
  const safeForm = form || {
    vehicle_type: "",
    make: "",
    model: "",
    year: "",
    plate_number: "",
    colour: "",
    date_acquired: "",
    status: "active",
    capacity: "",
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100 ">
      <AdminLayout>
        <h1 className="text-3xl text-gray-900 font-bold mb-6">Manage Vehicles</h1>

        {/* Vehicle Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 text-gray-900 lg:grid-cols-3 gap-4 bg-white p-4 rounded shadow"
        >
          <input
            placeholder="Vehicle Type"
            value={safeForm.vehicle_type}
            onChange={(e) => setForm({ ...safeForm, vehicle_type: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Make"
            value={safeForm.make}
            onChange={(e) => setForm({ ...safeForm, make: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Model"
            value={safeForm.model}
            onChange={(e) => setForm({ ...safeForm, model: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Year"
            value={safeForm.year}
            onChange={(e) => setForm({ ...safeForm, year: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Plate Number"
            value={safeForm.plate_number}
            onChange={(e) => setForm({ ...safeForm, plate_number: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Colour"
            value={safeForm.colour}
            onChange={(e) => setForm({ ...safeForm, colour: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Date Acquired"
            value={safeForm.date_acquired}
            onChange={(e) => setForm({ ...safeForm, date_acquired: e.target.value })}
            className="p-2 border rounded"
          />
          {/* ✅ Status combo box */}
          <select
            value={safeForm.status}
            onChange={(e) => setForm({ ...safeForm, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="not active">Not Active</option>
          </select>
          <input
            type="number"
            placeholder="Capacity"
            value={safeForm.capacity}
            onChange={(e) => setForm({ ...safeForm, capacity: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded col-span-full hover:bg-gray-700 transition"
          >
            Save
          </button>
        </form>

        {/* Vehicles Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Make</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Plate</th>
                <th className="px-4 py-2">Colour</th>
                <th className="px-4 py-2">Date Acquired</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Capacity</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((v) => (
                  <tr
                    key={v.vehicle_id}
                    className="border-b text-gray-900 text-center hover:bg-gray-200"
                  >
                    <td className="px-2 py-1">{v.vehicle_type}</td>
                    <td className="px-2 py-1">{v.make}</td>
                    <td className="px-2 py-1">{v.model}</td>
                    <td className="px-2 py-1">{v.year}</td>
                    <td className="px-2 py-1">{v.plate_number}</td>
                    <td className="px-2 py-1">{v.colour}</td>
                    <td className="px-2 py-1">{new Date(v.date_acquired).toLocaleDateString()}</td>
                    <td className="px-2 py-1">{v.status}</td>
                    <td className="px-2 py-1">{v.capacity}</td>
                    <td className="px-2 py-1">
                      <button
                        onClick={() => handleEdit(v)}
                        className="text-yellow-600 mr-2 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.vehicle_id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </div>
  );
}
