import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import CustomerLayout from "../../components/CustomerLayout";
import { Star, MessageSquare, CheckCircle, Download, X } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_LABELS = {
  Scheduled: "Scheduled",
  "On Route": "On Route",
  "Pending Confirmation": "Pending Confirmation",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export default function CustomerDeliveries() {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Modal State
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user?.user_id) return;
      setLoading(true);
      try {
        const customerRes = await api.get(`/customers/user/${user.user_id}`);
        const customerId = customerRes.data.customer_id;
        const res = await api.get(`/delivery/customer?customer_id=${customerId}`);
        setDeliveries(res.data || []);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
        setError("Failed to load deliveries.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, [user]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/delivery/${selectedDelivery.delivery_id}/confirm`, {
        rating,
        feedback
      });

      toast.success("Delivery Confirmed! Invoice Generated.");

      // Update local state
      setDeliveries(prev => prev.map(d => {
        if (d.delivery_id === selectedDelivery.delivery_id) {
          // Determine Invoice ID if returned, otherwise we might need to reload. 
          // The API returns { invoice: ... }
          const newInvoice = res.data.invoice;
          return {
            ...d,
            status: 'Completed',
            rating,
            feedback,
            invoices: newInvoice ? [newInvoice] : []
          };
        }
        return d;
      }));

      setSelectedDelivery(null);
    } catch (err) {
      console.error("Confirmation failed:", err);
      toast.error("Failed to confirm delivery.");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadInvoice = async (invoices) => {
    if (!invoices || invoices.length === 0) {
      toast.error("No invoice found.");
      return;
    }
    // Assuming one invoice per delivery for now, or take the latest
    const invoiceId = invoices[0].invoice_id;

    try {
      const response = await api.get(`/invoice/${invoiceId}/download`, {
        responseType: 'blob', // IMPORTANT
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download invoice.");
    }
  };

  if (loading) return <p className="p-6 text-center text-gray-600">Loading deliveries...</p>;

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Deliveries</h1>

        {deliveries.length === 0 ? (
          <div className="bg-white shadow-sm rounded-xl p-10 text-center text-gray-500 border border-gray-100">
            No deliveries found.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Item</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {deliveries.map((d) => (
                    <tr key={d.delivery_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">#{d.delivery_id}</td>
                      <td className="py-4 px-6 text-gray-600">{d?.order?.order_item || "-"}</td>
                      <td className="py-4 px-6 text-gray-600">{new Date(d.delivery_date).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${d.status === "Completed" ? "bg-green-100 text-green-800" :
                            d.status === "Pending Confirmation" ? "bg-purple-100 text-purple-800 animate-pulse" :
                              d.status === "On Route" ? "bg-blue-100 text-blue-800" :
                                d.status === "Cancelled" ? "bg-red-100 text-red-800" :
                                  "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {STATUS_LABELS[d.status] || d.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        {d.status === 'Pending Confirmation' && (
                          <button
                            onClick={() => setSelectedDelivery(d)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-deep-orange text-white rounded-lg shadow-md shadow-deep-orange/20 hover:bg-orange-700 transition text-sm font-medium"
                          >
                            <CheckCircle size={16} /> Confirm Receipt
                          </button>
                        )}

                        {d.status === 'Completed' && d.invoices && d.invoices.length > 0 && (
                          <button
                            onClick={() => downloadInvoice(d.invoices)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                          >
                            <Download size={16} /> Invoice
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/delivery/${d.delivery_id}`)}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {selectedDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 bg-deep-orange text-white flex justify-between items-center">
                <h3 className="text-lg font-bold">Confirm Delivery</h3>
                <button onClick={() => setSelectedDelivery(null)} className="text-white/80 hover:text-white"><X size={20} /></button>
              </div>

              <form onSubmit={handleConfirm} className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Please rate your delivery experience for Order #{selectedDelivery.order_id}</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all hover:scale-110 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      >
                        <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Feedback (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition resize-none"
                      rows="3"
                      placeholder="Tell us how we did..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDelivery(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-deep-orange text-white font-medium rounded-xl shadow-lg shadow-deep-orange/20 hover:bg-orange-700 transition disabled:opacity-70"
                  >
                    {submitting ? "Confirming..." : "Confirm & Download Invoice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </CustomerLayout>
  );
}
