import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";
import { useEffect } from "react";

export default function ManageInvoices() {
  const defaultForm = {
    invoice_id: "",
    order_id: "",
    customer_id: "",
    delivery_id: "",
    driver_id: "",
    vehicle_id: "",
    delivery_fee: "",
    quantity: "",
    price: "",
    total: "",
    status: "Unpaid",
  };

  const {
    data,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    loading
  } = useCRUD("invoice", defaultForm, "invoice_id");

  // Auto-calc total when editing or typing
  useEffect(() => {
    const q = Number(form.quantity);
    const p = Number(form.price);
    const fee = Number(form.delivery_fee);
    if (!isNaN(q) && !isNaN(p)) {
      setForm(prev => ({
        ...prev,
        total: q * p + fee
      }));
    }
  }, [form.quantity, form.price, form.delivery_fee]);

  return (
    <AdminLayout>
      <div className="p-4 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Manage Invoices</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md p-6 rounded-lg space-y-4"
        >
          {/* IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["order_id", "customer_id", "delivery_id", "driver_id", "vehicle_id"].map((key) => (
              <div key={key}>
                <label className="font-semibold block mb-1">{key.toUpperCase()}</label>
                <input
                  type="number"
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="border rounded p-3 w-full"
                  required
                />
              </div>
            ))}

            {/* Numeric entry */}
            {["quantity", "price", "delivery_fee"].map((key) => (
              <div key={key}>
                <label className="font-semibold block mb-1">{key.toUpperCase()}</label>
                <input
                  type="number"
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="border rounded p-3 w-full"
                  required
                />
              </div>
            ))}

            {/* Total */}
            <div>
              <label className="font-semibold block mb-1">TOTAL</label>
              <input
                type="number"
                value={form.total || ""}
                className="border rounded p-3 w-full bg-gray-200"
                readOnly
              />
            </div>

            {/* Status */}
            <div>
              <label className="font-semibold block mb-1">STATUS</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border rounded p-3 w-full"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
          >
            {loading ? "Saving..." : "Save Invoice"}
          </button>
        </form>

        {/* TABLE */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-900 text-gray-200">
              <tr>
                {[
                  "Invoice ID",
                  "Order ID",
                  "Customer ID",
                  "Delivery ID",
                  "Driver ID",
                  "Vehicle ID",
                  "Total",
                  "Status",
                  "Actions"
                ].map((col) => (
                  <th key={col} className="px-6 py-3 text-left font-semibold text-sm">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.map((inv) => (
                <tr key={inv.invoice_id}>
                  <td className="px-6 py-4">{inv.invoice_id}</td>
                  <td className="px-6 py-4">{inv.order_id}</td>
                  <td className="px-6 py-4">{inv.customer_id}</td>
                  <td className="px-6 py-4">{inv.delivery_id}</td>
                  <td className="px-6 py-4">{inv.driver_id}</td>
                  <td className="px-6 py-4">{inv.vehicle_id}</td>
                  <td className="px-6 py-4">{inv.total}</td>
                  <td className="px-6 py-4">{inv.status}</td>

                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(inv)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(inv.invoice_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
