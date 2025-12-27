import { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { io } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

const socket = io("https://delivery-management-system-backend-2385.onrender.com");

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Join admin room
    socket.emit("join_admin_room");

    // Listen for new orders
    socket.on("new_order", (data) => {
      toast.success(data.message || "New Order Received!", {
        duration: 5000,
        position: "top-right",
      });
    });

    // Listen for Delivery Pending Confirmation (Driver Arrived)
    socket.on("delivery_pending_confirmation", (data) => {
      toast(data.message || "Driver Arrived! Pending Customer Confirmation.", {
        icon: '🚚',
        duration: 5000,
        position: "top-right",
      });
    });

    // Listen for Delivery Confirmed (Invoice Generated)
    socket.on("delivery_confirmed", (data) => {
      toast.success(data.message || "Delivery Confirmed & Invoice Generated!", {
        duration: 5000,
        position: "top-right",
      });
    });

    return () => {
      socket.off("new_order");
      socket.off("delivery_pending_confirmation");
      socket.off("delivery_confirmed");
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster />
      {/* Sidebar - Mobile Overlay & Desktop Fixed */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        {/* Navbar */}
        <AdminNavbar onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 mt-16 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden glass"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
