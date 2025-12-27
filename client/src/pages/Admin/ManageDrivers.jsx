import React from "react";
import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";


export default function ManageDrivers() {
  const defaultDriverForm = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    sex: "Male",
    age: "",
    phone_number: "",
    license_number: "",
    license_qualification: "",
    license_expiry: "",
    vehicle_type: "",
    date_joined: "",
    status: "Active",
  };

  const { data, form, setForm, handleSubmit, handleEdit, handleDelete } =
    useCRUD("drivers", defaultDriverForm);

  if (!data) return <p className="p-6">Loading drivers...</p>;

  return (
    <div className="w-full min-h-screen">
      <AdminLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Manage Drivers</h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-black bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* Sex */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || "" })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* License Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                value={form.license_number}
                onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* License Qualification */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                License Qualification
              </label>
              <input
                value={form.license_qualification}
                onChange={(e) =>
                  setForm({ ...form, license_qualification: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* License Expiry Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                License Expiry Date
              </label>
              <input
                type="date"
                value={form.license_expiry}
                onChange={(e) => setForm({ ...form, license_expiry: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* Vehicle Type */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <input
                value={form.vehicle_type}
                onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* Date Joined */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Date Joined
              </label>
              <input
                type="date"
                value={form.date_joined}
                onChange={(e) => setForm({ ...form, date_joined: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-deep-orange text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium"
              >
                Save Driver
              </button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Name</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Email</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Sex</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Phone</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">License</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Qualification</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Expiry</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Veh Type</th>
                    <th className="py-4 px-6 text-left whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 text-center whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {Array.isArray(data) && data.length > 0 ? (
                    data.map((d) => (
                      <tr
                        key={d.driver_id || d.id}
                        className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg"
                      >
                        <td className="py-4 px-6 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100 whitespace-nowrap">{d.first_name} {d.last_name}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100 whitespace-nowrap">{d.email}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100 whitespace-nowrap">{d.sex}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100 whitespace-nowrap">{d.phone_number}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100 whitespace-nowrap">{d.license_number}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100 whitespace-nowrap">{d.license_qualification}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100 whitespace-nowrap">{d.license_expiry}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100 whitespace-nowrap">{d.vehicle_type}</td>
                        <td className="py-4 px-6 border-y border-gray-100 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${d.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center border-y last:border-r last:rounded-r-lg border-gray-100 whitespace-nowrap">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(d)}
                              className="text-gray-500 hover:text-deep-orange transition font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(d.driver_id || d.id)}
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
                        No drivers found
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
