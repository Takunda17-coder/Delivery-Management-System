import { useState, useEffect } from "react";
import axios from "axios";

/**
 * useCRUD hook
 * - endpoint: plural resource name used by your API e.g. "orders", "customers"
 * - defaultForm: default shape for the form
 * - idField: primary key field name in that resource (e.g. "order_id", "customer_id")
 */
export const useCRUD = (endpoint, defaultForm = {}, idField = "id") => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const API = "https://delivery-management-system-backend-2385.onrender.com/api";

  // fetch all records
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/${endpoint}`);
      setData(res.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  // Normalize an item into the form shape without dropping the id
  const normalizeForm = (item = {}) => {
    // Keep all keys from defaultForm, but allow item to override.
    const normalized = { ...defaultForm };
    // copy any keys in defaultForm from item (use null -> "" fallback)
    Object.keys(normalized).forEach((k) => {
      normalized[k] = item[k] !== undefined && item[k] !== null ? item[k] : normalized[k] === undefined ? "" : normalized[k];
    });
    // also ensure idField preserved if present in item
    if (item[idField] !== undefined && item[idField] !== null) {
      normalized[idField] = item[idField];
    } else {
      // if defaultForm included idField, keep that, otherwise remove
      if (defaultForm[idField] !== undefined) normalized[idField] = defaultForm[idField];
    }

    return normalized;
  };

  // build payload: cast numeric fields, keep strings as-is (including status and sex)
  const buildPayload = (raw) => {
    const payload = { ...raw };

    const numericFields = [
      "customer_id",
      "driver_id",
      "vehicle_id",
      "order_id",
      "invoice_id",
      "delivery_id",
      "quantity",
      "price",
      "priority",
      "total",
      "delivery_fee",
      "weight",
      "age",
    ];

    numericFields.forEach((f) => {
      if (payload[f] !== undefined && payload[f] !== "" && payload[f] !== null) {
        // allow decimals where appropriate
        payload[f] = Number(payload[f]);
      }
    });

    // ensure status defaults if missing (match backend enum capitalization)
    if (payload.status === undefined || payload.status === null || payload.status === "") {
      if (endpoint === "orders") payload.status = "Pending";
      if (endpoint === "deliveries") payload.status = "Scheduled";
      if (endpoint === "invoices") payload.status = "Unpaid";
    }

    return payload;
  };

  // Submit (create or update)
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage("");

    try {
      const id = form[idField];
      const payload = buildPayload(form);

      // backend expects plural endpoint e.g. /api/orders/:id
      if (id !== undefined && id !== null && id !== "") {
        // UPDATE
        await axios.put(`${API}/${endpoint}/${id}`, payload);
        setMessage("Updated successfully");
      } else {
        // CREATE
        await axios.post(`${API}/${endpoint}`, payload);
        setMessage("Created successfully");
      }

      // reset form and state
      setForm(defaultForm);
      setIsEditing(false);
      await fetchData();
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit -> populate form and set editing state
  const handleEdit = (item) => {
    const normalized = normalizeForm(item);
    setForm(normalized);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing helper
  const cancelEdit = () => {
    setForm(defaultForm);
    setIsEditing(false);
    setError(null);
    setMessage("");
  };

  // Delete with confirm
  const handleDelete = async (id, confirmMessage = "Are you sure you want to delete this record?") => {
    if (!window.confirm(confirmMessage)) return;
    try {
      await axios.delete(`${API}/${endpoint}/${id}`);
      await fetchData();
      setMessage("Deleted");
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError(err);
    }
  };

  return {
    data,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    cancelEdit,
    isEditing,
    loading,
    submitting,
    error,
    message,
    fetchData,
  };
};
