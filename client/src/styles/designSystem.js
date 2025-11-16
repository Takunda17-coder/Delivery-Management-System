/**
 * DESIGN SYSTEM - Global styling constants and utilities
 * Ensures consistency across all pages
 */

export const COLORS = {
  primary: "#1f2937", // Gray-900 (dark)
  primaryLight: "#374151", // Gray-700
  secondary: "#3b82f6", // Blue-500
  success: "#10b981", // Green-500
  warning: "#f59e0b", // Amber-500
  danger: "#ef4444", // Red-500
  light: "#f9fafb", // Gray-50
  border: "#e5e7eb", // Gray-200
  text: {
    primary: "#111827", // Gray-900
    secondary: "#6b7280", // Gray-500
    light: "#f3f4f6", // Gray-100
  },
};

export const STATUS_COLORS = {
  // Order/Delivery Status
  Pending: { bg: "bg-yellow-50", text: "text-yellow-700", badge: "bg-yellow-100" },
  Scheduled: { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100" },
  "On Route": { bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100" },
  Completed: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", badge: "bg-red-100" },
  Active: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100" },
  Inactive: { bg: "bg-gray-50", text: "text-gray-700", badge: "bg-gray-100" },
  Paid: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100" },
  Unpaid: { bg: "bg-red-50", text: "text-red-700", badge: "bg-red-100" },
  Overdue: { bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100" },
};

export const TAILWIND_CLASSES = {
  // Containers
  pageContainer: "min-h-screen bg-gray-50",
  contentContainer: "container mx-auto px-4 py-6 lg:px-8 lg:py-8",
  
  // Navigation
  navbar: "bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 shadow-lg flex justify-between items-center",
  navTitle: "text-2xl font-bold text-white",
  navButton: "bg-white text-gray-900 font-semibold hover:bg-gray-100 px-4 py-2 rounded-lg transition",
  
  // Cards
  card: "bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6",
  cardHeader: "text-xl font-bold text-gray-900 mb-4",
  cardBody: "text-gray-700 space-y-2",
  
  // Tables
  tableHeader: "bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold sticky top-0",
  tableRow: "border-b border-gray-200 hover:bg-gray-50 transition",
  tableCell: "px-6 py-4",
  
  // Forms
  formGroup: "flex flex-col gap-2 mb-4",
  label: "font-medium text-gray-700 text-sm",
  input: "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
  select: "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white",
  textarea: "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-32",
  
  // Buttons
  buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition",
  buttonSecondary: "bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition",
  buttonDanger: "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm",
  buttonWarning: "bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm",
  buttonSuccess: "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm",
  buttonSmall: "px-3 py-1 text-sm rounded-lg transition",
  buttonGroup: "flex gap-2 flex-wrap",
  
  // Badges
  badge: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
  
  // Alerts
  alertSuccess: "bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-4",
  alertError: "bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4",
  alertWarning: "bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-4",
  alertInfo: "bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-4",
};

/**
 * Get status badge styling based on status value
 */
export const getStatusBadgeClass = (status) => {
  const statusConfig = STATUS_COLORS[status];
  if (!statusConfig) return STATUS_COLORS.Pending;
  return `${statusConfig.badge} ${statusConfig.text}`;
};

/**
 * Get status background color class
 */
export const getStatusBgClass = (status) => {
  const statusConfig = STATUS_COLORS[status];
  if (!statusConfig) return STATUS_COLORS.Pending.bg;
  return statusConfig.bg;
};

/**
 * Format currency values
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

/**
 * Format date with consistent style
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format datetime
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
