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
      <div className="p-4 mr-10 ">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Manage Invoices</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black shadow-md p-6 rounded-xl border border-gray-100 space-y-4"
        >
          {/* IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["order_id", "customer_id", "delivery_id", "driver_id", "vehicle_id"].map((key) => (
              <div key={key}>
                <label className="font-medium block mb-1 text-gray-700">{key.replace('_', ' ').toUpperCase()}</label>
                <input
                  type="number"
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                  required
                />
              </div>
            ))}

            {/* Numeric entry */}
            {["quantity", "price", "delivery_fee"].map((key) => (
              <div key={key}>
                <label className="font-medium block mb-1 text-gray-700">{key.replace('_', ' ').toUpperCase()}</label>
                <input
                  type="number"
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                  required
                />
              </div>
            ))}

            {/* Total */}
            <div>
              <label className="font-medium block mb-1 text-gray-700">TOTAL</label>
              <input
                type="number"
                value={form.total || ""}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 text-gray-600"
                readOnly
              />
            </div>

            {/* Status */}
            <div>
              <label className="font-medium block mb-1 text-gray-700">STATUS</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-deep-orange text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700 transition font-medium"
            >
              {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </form>

        {/* TABLE */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
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
                  <th key={col} className="px-6 py-4 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="space-y-4">
              {data.map((inv) => (
                <tr key={inv.invoice_id} className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg">
                  <td className="px-6 py-4 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">{inv.invoice_id}</td>
                  <td className="px-6 py-4 text-gray-600 border-y border-gray-100">{inv.order_id}</td>
                  <td className="px-6 py-4 text-gray-600 border-y border-gray-100">{inv.customer_id}</td>
                  <td className="px-6 py-4 text-gray-600 border-y border-gray-100">{inv.delivery_id}</td>
                  <td className="px-6 py-4 text-gray-600 border-y border-gray-100">{inv.driver_id}</td>
                  <td className="px-6 py-4 text-gray-600 border-y border-gray-100">{inv.vehicle_id}</td>
                  <td className="px-6 py-4 text-gray-600 border-y border-gray-100">{inv.total}</td>
                  <td className="px-6 py-4 border-y border-gray-100">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      inv.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="text-gray-500 hover:text-deep-orange transition font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(inv.invoice_id)}
                        className="text-gray-400 hover:text-red-500 transition font-medium"
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
