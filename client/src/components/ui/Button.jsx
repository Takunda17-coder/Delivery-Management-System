import React from "react";

export default function Button({ children, onClick, className = "", type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-semibold transition-colors duration-200
        ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
