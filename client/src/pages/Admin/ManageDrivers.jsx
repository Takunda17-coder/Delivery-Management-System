import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { useCRUD } from "../../hooks/useCRUD";

export default function ManageDrivers() {
  const defaultDriverForm = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    sex: "male",
    age: "",
    phone_number: "",
    license_number: "",
    license_qualification: "",
    license_expiry: "",
    vehicle_type: "",
    date_joined: "",
    status: "active",
  };

  const { data, form, setForm, handleSubmit, handleEdit, handleDelete } =
    useCRUD("drivers", defaultDriverForm);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="w-full min-h-screen">
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Manage Drivers
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900"
        >
          <input
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={form.sex || "male"}
            onChange={(e) => setForm({ ...form, sex: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={(e) =>
              setForm({ ...form, age: parseInt(e.target.value) || "" })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="License Number"
            value={form.license_number}
            onChange={(e) => setForm({ ...form, license_number: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="License Qualification"
            value={form.license_qualification}
            onChange={(e) =>
              setForm({ ...form, license_qualification: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="License Expiry"
            type="date"
            value={form.license_expiry}
            onChange={(e) => setForm({ ...form, license_expiry: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Vehicle Type"
            value={form.vehicle_type}
            onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Date Joined"
            type="date"
            value={form.date_joined}
            onChange={(e) => setForm({ ...form, date_joined: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={form.status || "active"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
          >
            Save
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-900 text-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Sex</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">License</th>
                <th className="py-2 px-4 border-b">Vehicle Type</th>
                <th className="py-2 px-4 border-b">Date Joined</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((d) => (
                  <tr
                    key={d.driver_id || d.id}
                    className="text-center text-gray-900 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 border-b">{d.first_name} {d.last_name}</td>
                    <td className="py-2 px-4 border-b">{d.email}</td>
                    <td className="py-2 px-4 border-b">{d.sex}</td>
                    <td className="py-2 px-4 border-b">{d.phone_number}</td>
                    <td className="py-2 px-4 border-b">{d.license_number}</td>
                    <td className="py-2 px-4 border-b">{d.vehicle_type}</td>
                    <td className="py-2 px-4 border-b">{d.date_joined}</td>
                    <td className="py-2 px-4 border-b">{d.status}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEdit(d)}
                        className="text-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.driver_id || d.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No drivers found
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
