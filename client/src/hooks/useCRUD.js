import { useState, useEffect } from "react";
import axios from "axios";

export const useCRUD = (endpoint, defaultForm = {}, idField = "id") => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = "https://delivery-management-system-backend-2385.onrender.com/api";

  const normalizeForm = (item) => {
    const normalized = { ...defaultForm };
    for (const key in normalized) {
      normalized[key] = item[key] ?? "";
    }
    return normalized;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/${endpoint}`);
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

  const buildPayload = (form) => {
    const payload = { ...form };
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

    // Default statuses
    if (!payload.status) {
      if (endpoint === "orders") payload.status = "Pending";
      if (endpoint === "deliveries") payload.status = "Scheduled";
      if (endpoint === "invoices") payload.status = "Unpaid";
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = form[idField];
      const payload = buildPayload(form);

      if (id) {
        // PUT request for update
        await axios.put(`${API}/${endpoint}/${id}`, payload);
      } else {
        // POST request for create
        await axios.post(`${API}/${endpoint}`, payload);
      }

      setForm(defaultForm);
      setIsEditing(false);
      fetchData();
      alert(`${endpoint.slice(0, -1)} saved successfully!`);
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError(err);
    }
  };

  const handleEdit = (item) => {
    setForm(normalizeForm(item));
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API}/${endpoint}/${id}`);
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
    isEditing,
    loading,
    error,
  };
};
