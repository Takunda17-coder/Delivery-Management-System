// src/pages/admin/ManageCustomers.jsx
import React, { useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useCRUD } from "../../hooks/useCRUD";
import toast from "react-hot-toast";

export default function ManageCustomers() {
  const defaultCustomerForm = {
    customer_id: null,
    first_name: "",
    last_name: "",
    email: "",
    sex: "male",
    address: "",
    age: "",
    phone_number: "",
    password: "", // blank while editing so password unchanged unless provided
  };

  const {
    data,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    isEditing,
    setIsEditing,
    loading,
    error,
    refresh,
  } = useCRUD("customers", defaultCustomerForm, "customer_id");

  useEffect(() => {
    // ensure controlled values (no undefined)
    setForm((prev) => ({ ...defaultCustomerForm, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading customers.</p>;

  const validate = () => {
    if (!form.first_name || !form.last_name) {
      toast.error("First and last name required");
      return false;
    }
    if (!form.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      toast.error("Valid email required");
      return false;
    }
    if (form.age !== "" && (isNaN(Number(form.age)) || Number(form.age) < 0)) {
      toast.error("Age must be a positive number");
      return false;
    }
    if (form.phone_number && !/^[0-9+\s()-]{6,20}$/.test(form.phone_number)) {
      toast.error("Invalid phone number");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // delegate to hook but ensure password omission logic runs in hook (it does)
    try {
      await handleSubmit(e);
      setIsEditing(false);
      refresh();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const onEdit = (c) => {
    // when editing, don't preload password; keep empty
    const clone = { ...c, password: "" };
    handleEdit(clone);
  };

  return (
    <div className="w-full min-h-screen">
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Manage Customers
        </h1>

        <form
          onSubmit={onSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900"
        >
          <input
            placeholder="First Name"
            value={form.first_name || ""}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Last Name"
            value={form.last_name || ""}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder={
              isEditing ? "Leave blank to keep current password" : "Password"
            }
            type="password"
            value={form.password || ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={form.sex || "Male"}
            onChange={(e) => setForm({ ...form, sex: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            placeholder="Address"
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Age"
            type="number"
            value={form.age || ""}
            onChange={(e) =>
              setForm({
                ...form,
                age: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Phone Number"
            value={form.phone_number || ""}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            className="border p-2 rounded"
          />
          <div className="col-span-1 md:col-span-2 flex gap-2 justify-end">
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              {form.customer_id ? "Update Customer" : "Save Customer"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setForm(defaultCustomerForm);
                  setIsEditing(false);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border-b-gray-100 border-b rounded-lg">
            <thead className="bg-gray-900 text-gray-200">
              <tr>
                <th className="py-2 px-4">First Name</th>
                <th className="py-2 px-4">Last Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Sex</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4">Age</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((c) => (
                  <tr
                    key={c.customer_id}
                    className="text-center text-gray-900 border-b hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">{c.first_name}</td>
                    <td className="py-2 px-4">{c.last_name}</td>
                    <td className="py-2 px-4">{c.email}</td>
                    <td className="py-2 px-4">{c.sex}</td>
                    <td className="py-2 px-4">{c.address}</td>
                    <td className="py-2 px-4">{c.age}</td>
                    <td className="py-2 px-4">{c.phone_number}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => onEdit(c)}
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
