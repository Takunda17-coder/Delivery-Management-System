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
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Manage Customers</h1>

          <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-black bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div>
              <label className="block mb-1 font-medium text-gray-700">First Name</label>
              <input
                placeholder="First Name"
                value={form.first_name || ""}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Last Name</label>
              <input
                placeholder="Last Name"
                value={form.last_name || ""}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                placeholder="Email"
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Password (optional)</label>
              <input
                placeholder="Password"
                type="password"
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Sex</label>
              <select
                value={form.sex || "Male"}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Address</label>
              <input
                placeholder="Address"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Age</label>
              <input
                placeholder="Age"
                type="number"
                value={form.age === null || form.age === undefined ? "" : form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value === "" ? "" : Number(e.target.value) })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
              <input
                placeholder="Phone Number"
                value={form.phone_number || ""}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex gap-3 justify-end mt-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(defaultCustomerForm);
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-deep-orange text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium disabled:opacity-50"
              >
                {form.customer_id ? "Update Customer" : "Save Customer"}
              </button>
            </div>
          </form>

          {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">Error: {error.message || "An error occurred"}</div>}

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-left">First Name</th>
                    <th className="py-4 px-6 text-left">Last Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Sex</th>
                    <th className="py-4 px-6 text-left">Address</th>
                    <th className="py-4 px-6 text-left">Age</th>
                    <th className="py-4 px-6 text-left">Phone</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {Array.isArray(data) && data.length > 0 ? (
                    data.map((c) => (
                      <tr
                        key={c.customer_id}
                        className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg"
                      >
                        <td className="py-4 px-6 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">{c.first_name}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{c.last_name}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{c.email}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{c.sex}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{c.address}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{c.age}</td>
                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{c.phone_number}</td>
                        <td className="py-4 px-6 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => handleEdit(c)} className="text-gray-500 hover:text-deep-orange transition font-medium">Edit</button>
                            <button onClick={() => handleDelete(c.customer_id)} className="text-gray-400 hover:text-red-500 transition font-medium">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500 italic">No customers found</td>
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
};

export default ManageCustomers;
