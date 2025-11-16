import React from "react";
import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";


const ManageCustomers = () => {
  const defaultCustomerForm = {
    customer_id: null,
    first_name: "",
    last_name: "",
    email: "",
    sex: "Male", // matches DB ENUM (Male/Female/Other)
    address: "",
    age: "",
    phone_number: "",
    password: "",
  };

  const {
    data,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    isEditing,
    loading,
    submitting,
    error,
    message,
  } = useCRUD("customers", defaultCustomerForm, "customer_id");



  if (loading) return <p className="p-6">Loading customers...</p>;

  return (
    <div className="w-full min-h-screen">
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Manage Customers</h1>

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 text-black md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              placeholder="First Name"
              value={form.first_name || ""}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              placeholder="Last Name"
              value={form.last_name || ""}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              placeholder="Email"
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password (optional)</label>
            <input
              placeholder="Password"
              type="password"
              value={form.password || ""}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Sex</label>
            <select
              value={form.sex || "Male"}
              onChange={(e) => setForm({ ...form, sex: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              placeholder="Address"
              value={form.address || ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Age</label>
            <input
              placeholder="Age"
              type="number"
              value={form.age === null || form.age === undefined ? "" : form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value === "" ? "" : Number(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              placeholder="Phone Number"
              value={form.phone_number || ""}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex gap-2 justify-end mt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setForm(defaultCustomerForm);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            )}

            <button type="submit" disabled={submitting} className="bg-gray-800 text-white px-4 py-2 rounded">
              {form.customer_id ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </form>

        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">Error: {error.message || "An error occurred"}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full border-b-gray-100 border-b rounded-lg">
            <thead className="bg-gray-900 text-gray-200">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Sex</th>
                <th>Address</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((c) => (
                  <tr key={c.customer_id} className="text-center text-gray-900 border-b hover:bg-gray-50">
                    <td>{c.first_name}</td>
                    <td>{c.last_name}</td>
                    <td>{c.email}</td>
                    <td>{c.sex}</td>
                    <td>{c.address}</td>
                    <td>{c.age}</td>
                    <td>{c.phone_number}</td>
                    <td>
                      <button onClick={() => handleEdit(c)} className="text-yellow-600 mr-2">Edit</button>
                      <button onClick={() => handleDelete(c.customer_id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </div>
  );
};

export default ManageCustomers;
