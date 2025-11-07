import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { useCRUD } from "../../hooks/useCRUD";

export default function ManageCustomers() {
  // Default form state including password
  const defaultCustomerForm = {
    first_name: "",
    last_name: "",
    email: "",
    sex: "male", // default value to prevent uncontrolled warning
    address: "",
    age: "",
    phone_number: "",
    password: "", // new field for password
  };

  // Get CRUD hooks
  const { data, form, setForm, handleSubmit, handleEdit, handleDelete } =
    useCRUD("customers", defaultCustomerForm);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="w-full min-h-screen">
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Manage Customers
        </h1>

        {/* Customer Form */}
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
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border p-2 rounded"
          />
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
            onChange={(e) =>
              setForm({ ...form, phone_number: e.target.value })
            }
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
          >
            Save
          </button>
        </form>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-b-gray-100 border-b rounded-lg">
            <thead className="bg-gray-900 text-gray-200">
              <tr>
                <th className="py-2 px-4 ">First Name</th>
                <th className="py-2 px-4 ">Last Name</th>
                <th className="py-2 px-4 ">Email</th>
                <th className="py-2 px-4 ">Sex</th>
                <th className="py-2 px-4 ">Address</th>
                <th className="py-2 px-4 ">Age</th>
                <th className="py-2 px-4 ">Phone</th>
                <th className="py-2 px-4 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((c) => (
                  <tr
                    key={c.customer_id}
                    className="text-center text-gray-900 border-b-gray-100 border-b hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 ">{c.first_name}</td>
                    <td className="py-2 px-4 ">{c.last_name}</td>
                    <td className="py-2 px-4 ">{c.email}</td>
                    <td className="py-2 px-4 ">{c.sex}</td>
                    <td className="py-2 px-4 ">{c.address}</td>
                    <td className="py-2 px-4 ">{c.age}</td>
                    <td className="py-2 px-4 ">{c.phone_number}</td>
                    <td className="py-2 px-4 ">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.customer_id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No customers found
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
