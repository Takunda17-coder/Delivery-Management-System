// src/hooks/useCRUD.js
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "https://delivery-management-system-backend-2385.onrender.com/api";

/**
 * useCRUD(endpoint, defaultForm, idField)
 * - endpoint: plural resource e.g. "orders", "customers", "deliveries"
 * - defaultForm: object with default values (including idField if you want)
 * - idField: primary key field name (defaults to "id")
 */
export const useCRUD = (endpoint, defaultForm = {}, idField = "id") => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeFormForEdit = (item) => {
    // create a shallow copy that guarantees defined fields (avoid controlled/uncontrolled warnings)
    const normalized = { ...defaultForm, ...item };
    // ensure numbers remain numbers (but keep blanks as "")
    Object.keys(normalized).forEach((k) => {
      if (normalized[k] === null || normalized[k] === undefined) normalized[k] = "";
    });
    return normalized;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/${endpoint}`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err);
      toast.error(`Failed to load ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

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
    "age",
  ];

  const buildPayload = (raw) => {
    const payload = { ...raw };

    // Convert numeric fields where appropriate (allow floats for weight/price)
    numericFields.forEach((f) => {
      if (payload[f] === "" || payload[f] === undefined) {
        delete payload[f];
        return;
      }
      // weight, price, delivery_fee, total => float; ids & quantity & age => integer
      if (["weight", "price", "delivery_fee", "total"].includes(f)) {
        payload[f] = parseFloat(payload[f]);
      } else {
        payload[f] = Number(payload[f]);
      }
    });

    // Default status cases (normalize capitalization/strings to whatever backend expects)
    if (!payload.status) {
      if (endpoint === "orders") payload.status = "pending";
      if (endpoint === "deliveries") payload.status = "scheduled";
      if (endpoint === "invoices") payload.status = "unpaid";
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const id = form[idField];
      const payload = buildPayload(form);

      // special case: if updating a user/customer and password is empty -> do not send password
      if ((endpoint === "customers" || endpoint === "drivers" || endpoint === "users") && payload.password === "") {
        delete payload.password;
      }

      if (id) {
        // PUT update
        await axios.put(`${API}/${endpoint}/${id}`, payload);
        toast.success(`${endpoint.slice(0, -1)} updated`);
      } else {
        // POST create
        await axios.post(`${API}/${endpoint}`, payload);
        toast.success(`${endpoint.slice(0, -1)} created`);
      }

      setForm(defaultForm);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError(err);
      const msg = err.response?.data?.message || "Request failed";
      toast.error(msg);
    }
  };

  const handleEdit = (item) => {
    setForm(normalizeFormForEdit(item));
    setIsEditing(true);
    // scroll to top a little nicer for UX (optional)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API}/${endpoint}/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError(err);
      toast.error("Failed to delete");
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
    setIsEditing,
    loading,
    error,
    refresh: fetchData,
  };
};
