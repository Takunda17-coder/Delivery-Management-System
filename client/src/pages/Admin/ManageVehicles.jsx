import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";


export default function ManageVehicles() {
  const defaultVehicleForm = {
    vehicle_type: "",
    make: "",
    model: "",
    year: "",
    plate_number: "",
    colour: "",
    date_acquired: "",
    status: "Active",
    capacity: "",
  };

  const { data, form, setForm, handleSubmit, handleEdit, handleDelete } =
    useCRUD("vehicles", defaultVehicleForm, "vehicle_id");

  return (
    <div className="w-full min-h-screen">
      <AdminLayout>
        <div className="p-4">
          <h1 className="text-3xl text-gray-900 font-bold mb-6">Manage Vehicles</h1>

          {/* Vehicle Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div>
              <label className="block mb-1 font-medium text-gray-700">Vehicle Type</label>
              <input
                placeholder="Vehicle Type"
                value={form.vehicle_type}
                onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Make</label>
              <input
                placeholder="Make"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Model</label>
              <input
                placeholder="Model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Year</label>
              <input
                type="number"
                placeholder="Year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Plate Number</label>
              <input
                placeholder="Plate Number"
                value={form.plate_number}
                onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Colour</label>
              <input
                placeholder="Colour"
                value={form.colour}
                onChange={(e) => setForm({ ...form, colour: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Date Acquired</label>
              <input
                type="date"
                placeholder="Date Acquired"
                value={form.date_acquired}
                onChange={(e) => setForm({ ...form, date_acquired: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            {/* ✅ Status combo box */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              >
                <option value="active">Active</option>
                <option value="not active">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>
            <div className="col-span-full flex justify-end mt-4">
              <button
                type="submit"
                className="bg-deep-orange text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium"
              >
                Save Vehicle
              </button>
            </div>
          </form>

          {/* Vehicles Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-4 text-left">Type</th>
                    <th className="px-4 py-4 text-left">Make</th>
                    <th className="px-4 py-4 text-left">Model</th>
                    <th className="px-4 py-4 text-left">Year</th>
                    <th className="px-4 py-4 text-left">Plate</th>
                    <th className="px-4 py-4 text-left">Colour</th>
                    <th className="px-4 py-4 text-left">Acquired</th>
                    <th className="px-4 py-4 text-left">Status</th>
                    <th className="px-4 py-4 text-left">Capacity</th>
                    <th className="px-4 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {Array.isArray(data) && data.length > 0 ? (
                    data.map((v) => (
                      <tr
                        key={v.vehicle_id}
                        className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg"
                      >
                        <td className="px-4 py-4 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">{v.vehicle_type}</td>
                        <td className="px-4 py-4 text-gray-600 border-y border-gray-100">{v.make}</td>
                        <td className="px-4 py-4 text-gray-600 border-y border-gray-100">{v.model}</td>
                        <td className="px-4 py-4 text-gray-600 border-y border-gray-100">{v.year}</td>
                        <td className="px-4 py-4 text-gray-600 border-y border-gray-100">{v.plate_number}</td>
                        <td className="px-4 py-4 text-gray-600 border-y border-gray-100">{v.colour}</td>
                        <td className="px-4 py-4 text-gray-600 border-y border-gray-100">{new Date(v.date_acquired).toLocaleDateString()}</td>
                        <td className="px-4 py-4 border-y border-gray-100">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-600 border-y border-gray-100">{v.capacity}</td>
                        <td className="px-4 py-4 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(v)}
                              className="text-gray-500 hover:text-deep-orange transition font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(v.vehicle_id)}
                              className="text-gray-400 hover:text-red-500 transition font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-8 text-gray-500 italic">
                        No vehicles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
