import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

export default function useCRUD(endpoint, defaultForm = {}, idField = "id") {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // ✅ Fix: Add modal state
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  // Determine if we're editing
  const isEditing = editingId !== null;

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/${endpoint}`);
      const items = Array.isArray(res.data) ? res.data : res.data.data || [];
      setData(items);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [endpoint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage("");
      setError(null);

      if (editingId) {
        const res = await api.put(`/${endpoint}/${editingId}`, form);
        setMessage(res.data?.message || "Updated successfully");
      } else {
        const res = await api.post(`/${endpoint}`, form);
        setMessage(res.data?.message || "Created successfully");
      }

      setForm(defaultForm);
      setEditingId(null);
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "An error occurred";
      console.error("❌ Submit error:", errMsg);
      setError({ message: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    // Try to find ID field (prioritize idField param, then common id fields)
    const id = item[idField] || item.id || item[Object.keys(item)[0]];
    setEditingId(id);
    setForm(item);
    setModalOpen(true); // ✅ Open modal
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        setLoading(true);
        const res = await api.delete(`/${endpoint}/${id}`);
        setMessage(res.data?.message || "Deleted successfully");
        fetchAll();
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || "Delete failed";
        console.error("❌ Delete error:", errMsg);
        setError({ message: errMsg });
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(defaultForm);
    setMessage("");
    setError(null);
  };

  return {
    data,
    form,
    setForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    cancelEdit,
    loading,
    submitting,
    isEditing,
    message,
    error,
    fetchAll,
    modalOpen, // ✅ Export
    setModalOpen, // ✅ Export
  };
}
