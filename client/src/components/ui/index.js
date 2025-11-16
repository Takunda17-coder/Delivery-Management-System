import React from "react";
import { TAILWIND_CLASSES, getStatusBadgeClass } from "../../styles/designSystem";

/**
 * Versatile Badge component for status display
 */
export function Badge({ label, status, className = "" }) {
  if (status) {
    return (
      <span className={`${TAILWIND_CLASSES.badge} ${getStatusBadgeClass(status)}`}>
        {label || status}
      </span>
    );
  }
  return (
    <span className={`${TAILWIND_CLASSES.badge} bg-gray-100 text-gray-700 ${className}`}>
      {label}
    </span>
  );
}

/**
 * Card component with consistent styling
 */
export function Card({ title, children, footer, className = "" }) {
  return (
    <div className={`${TAILWIND_CLASSES.card} ${className}`}>
      {title && <h3 className={TAILWIND_CLASSES.cardHeader}>{title}</h3>}
      <div className={TAILWIND_CLASSES.cardBody}>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-gray-200">{footer}</div>}
    </div>
  );
}

/**
 * Stat card for dashboards
 */
export function StatCard({ title, value, icon, color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon && <div className={`p-3 rounded-full ${colorMap[color]} text-2xl`}>{icon}</div>}
      </div>
    </Card>
  );
}

/**
 * Alert component
 */
export function Alert({ type = "info", title, message, onClose }) {
  const alertStyles = {
    success: TAILWIND_CLASSES.alertSuccess,
    error: TAILWIND_CLASSES.alertError,
    warning: TAILWIND_CLASSES.alertWarning,
    info: TAILWIND_CLASSES.alertInfo,
  };

  return (
    <div className={alertStyles[type]}>
      <div className="flex justify-between items-start">
        <div>
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-lg font-bold cursor-pointer">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Form input with label
 */
export function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
}) {
  return (
    <div className={TAILWIND_CLASSES.formGroup}>
      {label && <label className={TAILWIND_CLASSES.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${TAILWIND_CLASSES.input} ${error ? "border-red-500" : ""}`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

/**
 * Form select with label
 */
export function FormSelect({
  label,
  value,
  onChange,
  options,
  required,
  error,
  disabled,
}) {
  return (
    <div className={TAILWIND_CLASSES.formGroup}>
      {label && <label className={TAILWIND_CLASSES.label}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${TAILWIND_CLASSES.select} ${error ? "border-red-500" : ""}`}
      >
        <option value="">Select an option</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

/**
 * Form textarea with label
 */
export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
  rows = 4,
}) {
  return (
    <div className={TAILWIND_CLASSES.formGroup}>
      {label && <label className={TAILWIND_CLASSES.label}>{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`${TAILWIND_CLASSES.textarea} ${error ? "border-red-500" : ""}`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

/**
 * Modal component
 */
export function Modal({ isOpen, title, children, onClose, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="border-t border-gray-200 p-6 flex gap-2 justify-end">{footer}</div>}
      </div>
    </div>
  );
}
