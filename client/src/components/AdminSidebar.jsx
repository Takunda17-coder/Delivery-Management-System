import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  ClipboardList,
  FileText,
  Package,
  X // Added X for close button
} from "lucide-react";

export default function AdminSidebar({ isOpen, onClose }) {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/managecustomers", label: "Customers", icon: <Users size={20} /> },
    { to: "/admin/managedrivers", label: "Drivers", icon: <Users size={20} /> },
    { to: "/admin/managevehicles", label: "Vehicles", icon: <Truck size={20} /> },
    { to: "/admin/managedevices", label: "GPS Devices", icon: <Truck size={20} /> }, // Using Truck icon for now, or ensure MapPin is imported if used
    { to: "/admin/profile", label: "Profile", icon: <User size={20} /> }, // New Profile Link
    { to: "/admin/manageorders", label: "Orders", icon: <ClipboardList size={20} /> },
    { to: "/admin/admindeliveries", label: "Deliveries", icon: <Package size={20} /> }, // Changed icon to Package
    { to: "/admin/manageinvoices", label: "Invoices", icon: <FileText size={20} /> },
  ];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Fleet<span className="text-deep-orange">Manager</span>
          </span>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose} // Close sidebar on mobile when link clicked
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group relative ${isActive
                  ? "bg-deep-orange/10 text-deep-orange"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-colors duration-200 ${isActive ? "text-deep-orange" : "text-gray-400 group-hover:text-gray-600"}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-deep-orange rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="text-xs text-center text-gray-400">
            © {new Date().getFullYear()} Fleet Management System
          </div>
        </div>
      </aside>
    </>
  );
}
