import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { Modal, FormInput, FormSelect } from "../../components/ui";

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
    status: "Paid", // Default to Paid as requested
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

  // Local state for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openCreateModal = () => {
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (invoice) => {
    handleEdit(invoice); // Populates form and sets isEditing=true (inside hook)
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    await handleSubmit(e); // Calls hook's submit
    setIsModalOpen(false); // Close on success (optimistic)
  };

  // Download Handler
  const handleDownload = async (invoiceId) => {
    try {
      const response = await api.get(`/invoice/${invoiceId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Invoice downloading...");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download invoice.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 mr-10 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Invoices</h1>
          <button
            onClick={openCreateModal}
            className="bg-deep-orange text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            + Create Invoice
          </button>
        </div>

        {/* TABLE */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                <tr>
                  {[
                    "Invoice ID",
                    "Order ID",
                    "Customer",
                    "Total",
                    "Status",
                    "Date",
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
                    <td className="px-6 py-4 text-gray-600 border-y border-gray-100">#{inv.order_id}</td>
                    <td className="px-6 py-4 text-gray-600 border-y border-gray-100">
                      {inv.customer ? `${inv.customer.first_name} ${inv.customer.last_name || ''}` : inv.customer_id}
                    </td>
                    <td className="px-6 py-4 text-gray-600 border-y border-gray-100">${inv.total}</td>
                    <td className="px-6 py-4 border-y border-gray-100">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        inv.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 border-y border-gray-100">{new Date(inv.issue_date).toLocaleDateString()}</td>

                    <td className="px-6 py-4 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDownload(inv.invoice_id)}
                          className="p-1.5 text-gray-500 hover:text-deep-orange hover:bg-orange-100 rounded-lg transition"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(inv)}
                          className="text-gray-500 hover:text-blue-600 text-sm font-medium px-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inv.invoice_id)}
                          className="text-gray-400 hover:text-red-500 text-sm font-medium px-2"
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

        {/* EDIT/CREATE MODAL */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={form.invoice_id ? "Edit Invoice" : "Create Invoice"}
          footer={
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-deep-orange text-white rounded-lg hover:bg-orange-700"
              >
                Save Invoice
              </button>
            </div>
          }
        >
          <form className="space-y-4">
            <FormInput
              label="Order ID"
              value={form.order_id}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Customer ID"
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              />
              <FormInput
                label="Driver ID"
                value={form.driver_id}
                onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Vehicle ID"
                value={form.vehicle_id}
                onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
              />
              <FormInput
                label="Delivery Fee"
                type="number"
                value={form.delivery_fee}
                onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
              <FormInput
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <FormInput
              label="Total (Calculated)"
              value={form.total}
              disabled
              className="bg-gray-100"
            />
            <FormSelect
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={[
                { value: "Paid", label: "Paid" },
                { value: "Unpaid", label: "Unpaid" },
                { value: "Overdue", label: "Overdue" },
              ]}
              required
            />
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
