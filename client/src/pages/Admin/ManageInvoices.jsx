import { useEffect } from "react";
import useCRUD from "../../hooks/useCRUD";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import jsPDF from "jspdf";
import "jspdf-autotable";


export default function ManageInvoices() {
  const defaultForm = {
    delivery_id: "",
    order_id: "",
    customer_id: "",
    driver_id: "",
    vehicle_id: "",
    quantity: "",
    price: "",
    delivery_fee: "",
    total: "",
    order_items: "",
    status: "Unpaid",
  };

  const { data, form, setForm, handleSubmit, handleEdit, handleDelete, loading } = useCRUD("invoice", defaultForm, "invoice_id");

  // Auto-fill invoice fields based on delivery_id
  useEffect(() => {
    if (!form?.delivery_id) return;

    const fetchDelivery = async () => {
      try {
        const res = await axios.get(
          `https://delivery-management-system-backend-2385.onrender.com/api/delivery/${form.delivery_id}`
        );
        const delivery = res.data;

        if (delivery) {
          setForm((prev) => ({
            ...prev,
            order_id: delivery.order_id ?? prev.order_id,
            driver_id: delivery.driver_id ?? prev.driver_id,
            vehicle_id: delivery.vehicle_id ?? prev.vehicle_id,
            quantity: delivery.quantity ?? prev.quantity,
            price: delivery.price ?? prev.price,
            delivery_fee: delivery.delivery_fee ?? prev.delivery_fee,
            total:
              delivery.total ??
              (delivery.quantity && delivery.price
                ? delivery.quantity * delivery.price
                : prev.total),
            customer_id: delivery.customer_id ?? prev.customer_id,
          }));
        }
      } catch (err) {
        console.error("❌ Fetch delivery error:", err);
      }
    };

    fetchDelivery();
  }, [form?.delivery_id]);

  // Generate PDF for invoice
  const generatePDF = (invoice) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.invoice_id || ""}`, 14, 30);
    doc.text(`Delivery ID: ${invoice.delivery_id || ""}`, 14, 36);
    doc.text(`Order ID: ${invoice.order_id || ""}`, 14, 42);
    doc.text(`Customer ID: ${invoice.customer_id || ""}`, 14, 48);
    doc.text(`Driver ID: ${invoice.driver_id || ""}`, 14, 54);
    doc.text(`Vehicle ID: ${invoice.vehicle_id || ""}`, 14, 60);
    doc.text(`Issue Date: ${invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : ""}`, 14, 66);
    doc.text(`Status: ${invoice.status || ""}`, 14, 72);

    // Table for order items
    const items = invoice.order_items
      ? invoice.order_items.split(",").map((item) => [item, invoice.quantity || "", invoice.price || ""])
      : [];

    doc.autoTable({
      startY: 80,
      head: [["Item", "Quantity", "Price"]],
      body: items,
    });

    doc.text(`Delivery Fee: ${invoice.delivery_fee || 0}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total: ${invoice.total || 0}`, 14, doc.lastAutoTable.finalY + 16);

    doc.save(`Invoice_${invoice.invoice_id || "new"}.pdf`);
  };

  return (
    <AdminLayout>
      <div className="p-2">
        <h1 className="text-3xl text-gray-900 font-bold mb-6">Manage Invoices</h1>

        {/* Invoice Form */}
        <form onSubmit={handleSubmit} className="bg-white text-gray-900 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block font-semibold mb-1">Delivery ID</label>
            <input
              type="number"
              placeholder="Enter Delivery ID"
              value={form.delivery_id || ""}
              onChange={(e) => setForm({ ...form, delivery_id: e.target.value })}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Auto-filled fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["order_id", "customer_id", "driver_id", "vehicle_id", "quantity", "price", "delivery_fee", "total"].map((key) => (
              <div key={key}>
                <label className="block font-semibold mb-1">{key.replace("_", " ").toUpperCase()}</label>
                <input
                  type={["quantity", "price", "delivery_fee", "total"].includes(key) ? "number" : "text"}
                  value={form[key] || ""}
                  onChange={["order_id", "customer_id", "quantity", "price", "delivery_fee"].includes(key)
                    ? (e) => setForm({ ...form, [key]: e.target.value })
                    : undefined
                  }
                  className={`border p-3 rounded w-full ${["driver_id","vehicle_id","total","order_id"].includes(key) ? "bg-gray-100" : ""}`}
                  readOnly={["driver_id","vehicle_id","total","order_id"].includes(key)}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block font-semibold mb-1">Order Items</label>
            <input
              type="text"
              value={form.order_items || ""}
              onChange={(e) => setForm({ ...form, order_items: e.target.value })}
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              value={form.status || "unpaid"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-3 rounded w-full"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <button type="submit" className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition">
            {loading ? "Saving..." : "Save Invoice"}
          </button>
        </form>

        {/* Invoice Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white text-gray-900 rounded-lg shadow-md divide-y divide-gray-200">
            <thead className="bg-gray-900 text-gray-200 border-b-gray-100 border-b">
              <tr>
                {["Invoice ID","Delivery ID","Order ID","Customer ID","Driver ID","Vehicle ID","Total","Status","Issue Date","Actions"].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-sm font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-b-gray-100 border-b">
              {data.map((i) => (
                <tr key={i.invoice_id || i.id}>
                  <td className="px-6 py-4 text-sm">{i.invoice_id}</td>
                  <td className="px-6 py-4 text-sm">{i.delivery_id}</td>
                  <td className="px-6 py-4 text-sm">{i.order_id}</td>
                  <td className="px-6 py-4 text-sm">{i.customer_id}</td>
                  <td className="px-6 py-4 text-sm">{i.driver_id}</td>
                  <td className="px-6 py-4 text-sm">{i.vehicle_id}</td>
                  <td className="px-6 py-4 text-sm">{i.total}</td>
                  <td className="px-6 py-4 text-sm">{i.status}</td>
                  <td className="px-6 py-4 text-sm">{i.issue_date ? new Date(i.issue_date).toLocaleDateString() : ""}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button onClick={() => handleEdit(i)} className="text-yellow-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(i.invoice_id || i.id)} className="text-red-600 hover:underline">Delete</button>
                    <button onClick={() => generatePDF(i)} className="text-blue-600 hover:underline">PDF</button>
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
