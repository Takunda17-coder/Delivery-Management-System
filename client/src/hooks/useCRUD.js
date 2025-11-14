import { useState, useEffect } from "react";
import axios from "axios";

const useCRUD = (endpoint, defaultForm, idField = "id") => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const api = `https://delivery-management-system-backend-2385.onrender.com/api/${endpoint}`;

  // --- FETCH DATA -----------------------------------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(api);

      // Always ensure data is an array
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CREATE / UPDATE ------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError(null);

    try {
      if (form[idField]) {
        // UPDATE
        await axios.put(`${api}/${form[idField]}`, form);
        setMessage("Updated successfully.");
      } else {
        // CREATE
        await axios.post(api, form);
        setMessage("Created successfully.");
      }

      // Reset form & reload
      setForm(defaultForm);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error("Submit Error:", err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // --- EDIT -----------------------------------------------------------
  const handleEdit = (row) => {
    setIsEditing(true);

    // Merge to avoid undefined fields
    setForm({
      ...defaultForm,
      ...row,
    });
  };

  // --- DELETE ---------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err);
    }
  };

  // --- CANCEL EDIT ----------------------------------------------------
  const cancelEdit = () => {
    setIsEditing(false);
    setForm(defaultForm);
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
  };
};

// REQUIRED because you import like: `import useCRUD from ...`
export default useCRUD;
