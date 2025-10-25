import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Generic CRUD hook for API resources.
 * 
 * @param {string} endpoint - Singular API endpoint e.g., 'invoice', 'delivery'
 * @param {object} defaultForm - Default form state
 * @param {string} idField - Primary key field name, default 'id'
 */
export const useCRUD = (endpoint, defaultForm = {}, idField = "id") => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all records
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://delivery-management-system-lbuv-o194birwp.vercel.app/api/${endpoint}`);
      setData(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // Normalize payload for numeric fields and defaults
  const buildPayload = (form) => {
    const payload = { ...form };

    // Numeric fields across modules
    const numericFields = [
      "customer_id",
      "driver_id",
      "vehicle_id",
      "order_id",
      "invoice_id",
      "delivery_id",
      "quantity",
      "price",
      "total",
      "delivery_fee",
      "weight",
    ];
    numericFields.forEach((field) => {
      if (payload[field] !== undefined && payload[field] !== "")
        payload[field] = Number(payload[field]);
    });

    // Auto-calc total if price and quantity exist
    if (payload.price && payload.quantity && !payload.total) {
      payload.total = payload.price * payload.quantity;
    }

    // Default statuses
    if (!payload.status) {
      if (endpoint === "order") payload.status = "pending";
      if (endpoint === "delivery") payload.status = "scheduled";
      if (endpoint === "invoice") payload.status = "unpaid";
    }

    // Auto-fill dates
    if (endpoint === "delivery" && !payload.delivery_date) {
      payload.delivery_date = new Date().toISOString();
    }
    if (endpoint === "invoice" && !payload.issue_date) {
      payload.issue_date = new Date().toISOString();
    }

    return payload;
  };

  // Create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = form[idField];
      const payload = buildPayload(form);

      if (!id) delete payload[idField]; // Remove id for new records

      if (id) {
        await axios.put(`https://delivery-management-system-lbuv-o194birwp.vercel.app/api/${endpoint}/${id}`, payload);
      } else {
        await axios.post(`https://delivery-management-system-lbuv-o194birwp.vercel.app/api/${endpoint}`, payload);
      }

      setForm(defaultForm);
      fetchData();
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError(err);
    }
  };

  // Edit: populate form
  const handleEdit = (item) => setForm(item);

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`https://delivery-management-system-lbuv-o194birwp.vercel.app/api/${endpoint}/${id}`);
      fetchData();
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
    loading,
    error,
  };
};
