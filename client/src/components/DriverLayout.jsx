import { useState, useEffect } from "react";
import DriverNavbar from "./DriverNavbar";
import DriverSidebar from "./DriverSidebar";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

const socket = io("https://delivery-management-system-backend-2385.onrender.com");

export default function DriverLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    // Join Driver Room and Listen for Assignments
    useEffect(() => {
        const joinRoom = async () => {
            if (!user?.user_id) return;
            try {
                // Fetch driver details to get driver_id
                // Note: Assuming endpoint exists to get driver by user_id
                // Or if we can find a way to get driver_id from context.
                // Checking previous code: DriverDashboard fetches by user_id.
                // Let's use the same logic here.
                const response = await fetch(`https://delivery-management-system-backend-2385.onrender.com/api/drivers/user/${user.user_id}`);
                const data = await response.json();

                if (data.driver_id) {
                    socket.emit("join_driver_room", data.driver_id);
                    console.log("Joined room for driver:", data.driver_id);
                }
            } catch (err) {
                console.error("Failed to join driver room:", err);
            }
        };

        if (user && user.role === 'driver') {
            joinRoom();
        }

        socket.on("delivery_assigned", (data) => {
            toast.success(data.message, {
                duration: 6000,
                position: "top-center",
                icon: "🚚",
                style: {
                    background: '#333',
                    color: '#fff',
                },
            });
            // Optional: Play sound or vibrate
        });

        return () => {
            socket.off("delivery_assigned");
        };
    }, [user]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Toaster />
            {/* Sidebar - Mobile Overlay & Desktop Fixed */}
            <DriverSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
                {/* Navbar */}
                <DriverNavbar onMenuClick={toggleSidebar} />

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
