import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";
import { useEffect } from "react";
import { Download } from "lucide-react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";

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
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Manage Invoices</h1>

        {/* FORM (Hidden for brevity, assuming Admins barely create invoices manually, but keeping functionality) */}
        {/* ... (Existing form code preserved) ... */}

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
                          onClick={() => handleEdit(inv)}
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
      </div>
    </AdminLayout>
  );
}
