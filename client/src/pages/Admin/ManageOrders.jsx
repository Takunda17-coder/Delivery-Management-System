import React, { useEffect, useState } from "react";
import useCRUD from "../../hooks/useCRUD";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Modal, FormInput, FormSelect, Badge } from "../../components/ui/index.jsx";
import { toast } from "react-hot-toast";




const ManageOrders = () => {
  const navigate = useNavigate();
  const defaultForm = {
    order_id: null,
    customer_id: "",
    order_item: "",
    quantity: 1,
    price: 0,
    total: 0,
    weight: 0.0,
    pickup_address: "",
    status: "Pending", // ✅ Default to Pending when creating new order (auto -> Scheduled when delivery assigned -> Completed when delivered)
  };

  const {
    data: orders,
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
    fetchAll,
  } = useCRUD("orders", defaultForm, "order_id");

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get(`/customers`);
        if (Array.isArray(res.data)) {
          setCustomers(res.data);
        } else {
          console.error("Invalid customers response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  // Assign Delivery modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({
    order_id: "",
    driver_id: "",
    vehicle_id: "",
    pickup_address: "",
    dropoff_address: "",
    delivery_date: "",
    expected_delivery_time: "",
    delivery_fee: "",
    total: "",
    priority: "Low",
    status: "Scheduled",
    recipient_name: "",
    recipient_contact: "",
  });
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [assigning, setAssigning] = useState(false);

  // keep total accurate when quantity/price/weight change
  const updateNumberField = (field, value) => {
    // allow decimals
    const parsed = value === "" ? "" : Number(value);
    const newForm = { ...form, [field]: parsed };
    // recalc total when quantity or price changes
    if ((field === "quantity" || field === "price") && newForm.quantity !== "" && newForm.price !== "") {
      newForm.total = Number(newForm.quantity || 0) * Number(newForm.price || 0);
    }
    setForm(newForm);
  };

  const openAssignModal = async (order) => {
    setSelectedOrder(order);
    setDeliveryForm((prev) => ({
      ...prev,
      order_id: order.order_id,
      pickup_address: order.pickup_address || "",
      dropoff_address: order.dropoff_address || "", // ✅ Use dropoff_address
      total: order.total || 0,
      delivery_date: new Date().toISOString().slice(0, 16),
      recipient_name: order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : "",
      recipient_contact: order.customer ? order.customer.phone_number : "",
      delivery_fee: "", // manual entry
    }));

    // fetch drivers and vehicles
    try {
      const [drvRes, vehRes] = await Promise.all([api.get('/drivers'), api.get('/vehicles')]);
      setDrivers(Array.isArray(drvRes.data) ? drvRes.data : []);
      setVehicles(Array.isArray(vehRes.data) ? vehRes.data : []);
    } catch (err) {
      console.error('Failed to load drivers/vehicles', err);
    }

    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssigning(true);
    try {
      const res = await api.post('/delivery', deliveryForm);
      // refresh orders & deliveries
      fetchAll();
      setAssignModalOpen(false);
      setSelectedOrder(null);
      toast.success(res.data?.message || 'Delivery assigned successfully!');
    } catch (err) {
      console.error('Failed to assign delivery', err);
      toast.error(err.response?.data?.message || 'Failed to assign delivery');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Manage Orders</h2>

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 text-black md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          {/* Customer */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Customer</label>
            {isEditing ? (
              // show readonly label when editing (you requested customer not editable when editing)
              <input
                type="text"
                readOnly
                value={
                  customers.find((c) => c.customer_id === form.customer_id)
                    ? `${customers.find((c) => c.customer_id === form.customer_id).first_name} ${customers.find((c) => c.customer_id === form.customer_id).last_name}`
                    : form.customer_id || ""
                }
                className="border border-gray-300 p-2 rounded-lg bg-gray-50 w-full text-gray-600"
              />
            ) : (
              <select
                value={form.customer_id || ""}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value ? Number(e.target.value) : "" })}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Item */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Order Item</label>
            <input
              value={form.order_item || ""}
              onChange={(e) => setForm({ ...form, order_item: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.quantity === "" ? "" : form.quantity}
              onChange={(e) => updateNumberField("quantity", e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price === "" ? "" : form.price}
              onChange={(e) => updateNumberField("price", e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Pickup Address (span full width) */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Pickup Address</label>
            <input
              value={form.pickup_address || ""}
              onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              required
            />
          </div>



          {/* Total */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Total</label>
            <input type="number" value={form.total || 0} readOnly className="border border-gray-300 p-2 rounded-lg bg-gray-50 w-full text-gray-600" />
          </div>

          {/* Weight (decimals allowed) */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.weight === "" ? "" : form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value === "" ? "" : Number(e.target.value) })}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Status */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Status</label>
            <select
              value={form.status || "Pending"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex gap-3 justify-end mt-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setForm(defaultForm);
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-deep-orange text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium"
            >
              {form.order_id ? "Update Order" : "Save Order"}
            </button>
          </div>
        </form>

        {/* messaging */}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">Error: {error.message || "An error occurred"}</div>}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="py-4 px-6 text-left">Order ID</th>
                <th className="py-4 px-6 text-left">Customer</th>
                <th className="py-4 px-6 text-left">Item</th>
                <th className="py-4 px-6 text-left">Qty</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-left">Pickup</th>
                <th className="py-4 px-6 text-left">Total</th>
                <th className="py-4 px-6 text-left">Weight</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500 italic">
                    No orders
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.order_id} className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg">
                    <td className="py-4 px-6 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">{o.order_id}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{o.customer?.first_name} {o.customer?.last_name}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{o.order_item}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{o.quantity}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{o.price}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{o.pickup_address}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{o.total}</td>
                    <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{o.weight}</td>
                    <td className="py-4 px-6 border-y border-gray-100"><Badge status={o.status} label={o.status} /></td>
                    <td className="py-4 px-6 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(o)} className="text-gray-500 hover:text-deep-orange transition font-medium">Edit</button>
                        <button onClick={() => handleDelete(o.order_id)} className="text-gray-400 hover:text-red-500 transition font-medium">Delete</button>
                        {o.status === 'Pending' && (
                          <button onClick={() => openAssignModal(o)} className="text-blue-600 hover:text-blue-800 transition font-medium">Assign</button>
                        )}
                        {(o.status === 'Scheduled' || o.status === 'On Route') && o.deliveries && o.deliveries.length > 0 && (
                          <button
                            onClick={() => navigate(`/delivery/${o.deliveries[0].delivery_id}`)}
                            className="text-deep-orange hover:text-orange-700 transition font-medium"
                          >
                            Track
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Assign Delivery Modal */}
        {assignModalOpen && (
          <Modal isOpen={assignModalOpen} title={`Assign Delivery - Order #${selectedOrder?.order_id}`} onClose={() => setAssignModalOpen(false)} footer={null}>
            <form onSubmit={handleAssignSubmit} className="space-y-4 text-black">
              <FormSelect
                label="Driver"
                value={deliveryForm.driver_id}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, driver_id: e.target.value })}
                options={drivers.map(d => ({ value: d.driver_id, label: `${d.first_name} ${d.last_name}` }))}
                required
              />

              <FormSelect
                label="Vehicle"
                value={deliveryForm.vehicle_id}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, vehicle_id: e.target.value })}
                options={vehicles.map(v => ({ value: v.vehicle_id, label: `${v.make} ${v.model} (${v.plate_number})` }))}
                required
              />

              <FormInput label="Pickup Address" value={deliveryForm.pickup_address} onChange={(e) => setDeliveryForm({ ...deliveryForm, pickup_address: e.target.value })} required />
              <FormInput label="Dropoff Address" value={deliveryForm.dropoff_address} onChange={(e) => setDeliveryForm({ ...deliveryForm, dropoff_address: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Recipient Name" value={deliveryForm.recipient_name} onChange={(e) => setDeliveryForm({ ...deliveryForm, recipient_name: e.target.value })} required />
                <FormInput label="Recipient Contact" value={deliveryForm.recipient_contact} onChange={(e) => setDeliveryForm({ ...deliveryForm, recipient_contact: e.target.value })} required />
              </div>
              <FormInput label="Delivery Fee" type="number" step="0.01" value={deliveryForm.delivery_fee} onChange={(e) => setDeliveryForm({ ...deliveryForm, delivery_fee: e.target.value })} required />

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Delivery Date" type="datetime-local" value={deliveryForm.delivery_date} onChange={(e) => setDeliveryForm({ ...deliveryForm, delivery_date: e.target.value })} required />
                <FormInput label="Expected Time" type="time" value={deliveryForm.expected_delivery_time} onChange={(e) => setDeliveryForm({ ...deliveryForm, expected_delivery_time: e.target.value })} required />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setAssignModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium">Cancel</button>
                <button type="submit" disabled={assigning} className="bg-deep-orange text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium">{assigning ? 'Assigning...' : 'Assign Delivery'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
