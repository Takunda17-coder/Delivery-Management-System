import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://delivery-management-system-backend-2385.onrender.com/api";

export const useCRUD = (endpoint, defaultForm) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch all records
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/${endpoint}`);
      // Normalize dates for display
      const normalizedData = res.data.map((item) => {
        const copy = { ...item };
        for (const key in copy) {
          if (key.includes("date") || key.includes("expiry")) {
            if (copy[key]) {
              const date = new Date(copy[key]);
              if (!isNaN(date)) {
                copy[key] = date.toISOString().split("T")[0]; // 'yyyy-MM-dd'
              }
            }
          }
        }
        return copy;
      });
      setData(normalizedData);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // 📝 Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Normalize form data before sending
      const payload = { ...form };
      for (const key in payload) {
        if (payload[key] === "") payload[key] = null;
        if (key.includes("date") || key.includes("expiry")) {
          if (payload[key]) payload[key] = new Date(payload[key]).toISOString();
        }
        if (typeof payload[key] === "string") {
          // Trim and keep enums consistent
          payload[key] = payload[key].trim();
        }
      }

      if (editingId) {
        await axios.put(`${API_BASE}/${endpoint}/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/${endpoint}`, payload);
      }

      setForm(defaultForm);
      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error("❌ Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit existing record
  const handleEdit = (item) => {
    const formatted = { ...item };
    for (const key in formatted) {
      if (key.includes("date") || key.includes("expiry")) {
        if (formatted[key]) {
          formatted[key] = formatted[key].split("T")[0]; // strip time
        }
      }
    }
    setForm(formatted);
    setEditingId(item.id || item.driver_id || item.delivery_id);
  };

  // 🗑️ Delete record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API_BASE}/${endpoint}/${id}`);
      await fetchData();
    } catch (err) {
      console.error("❌ Delete error:", err);
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
  };
};
