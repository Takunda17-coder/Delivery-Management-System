import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  ClipboardList,
  FileText,
  CreditCard,
} from "lucide-react";

export default function AdminSidebar() {
  const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/managecustomers", label: "Customers" },
  { to: "/admin/managedrivers", label: "Drivers" },
  { to: "/admin/managevehicles", label: "Vehicles" },
  { to: "/admin/manageorders", label: "Orders" },
  { to: "/admin/manageinvoices", label: "Invoices" },
  {to: "/admin/admindeliveries", label: "Deliveries" }
  
];

  return (
    <aside className="fixed bg-gray-900 text-white w-60 min-h-screen flex flex-col p-4 ">
      <h2 className="text-md font-bold mb-8 text-center border-b  pb-3 pt-12">
        Admin Menu
      </h2>

      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                isActive ? "bg-gray-200 shadow-md text-gray-900" : "hover:shadow-md hover:bg-gray-700"
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Fleet System
      </div>
    </aside>
  );
}
