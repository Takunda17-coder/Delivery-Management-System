import { useState, useEffect } from "react";
import CustomerNavbar from "./CustomerNavbar";
import CustomerSidebar from "./CustomerSidebar";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

const socket = io("https://delivery-management-system-backend-2385.onrender.com");

export default function CustomerLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth(); // Need user to join specific room

    useEffect(() => {
        if (user?.customer_id) { // Assuming customer_id is available in user object or fetched context
            // Join customer room
            // Note: In some setups user might not have customer_id directly, ensure it maps correctly
            // If user only has user_id, we might need to fetch customer_id or join room based on user_id if consistent
            // Based on previous code, we often fetch customer_id. Let's assume for now we can get it or use user_id if mapped.
            // However, the backend expects `join_customer_room` with `customerId`.
            // If `user.customer_id` is not on the user object (it usually isn't, just user_id), we might need to rely on the backend mapping
            // OR, better, let's fetch customer_id first or pass it in.
            // But simpler: let's try to join using user_id if customer_id isn't there, or better, the previous pages fetched customer_id.
            // Ideally, AuthContext should provide the full profile.
            // For safety, let's try to join if we have it, but we might miss it if it's not in context.
            // **Wait**: `useAuth` provides `user`. Let's check if we can join `customer_${customer_id}_room`.
            // If we don't have it easily, we might need to fetch it.
            // Strategy: The backend emits to `customer_${customer_id}_room`.
            // We need the customer_id.
            // Let's defer joining until we have it, or we can fetch it here.

            // SIMPLIFICATION:
            // Let's assume for this step we will fetch the customer profile to get the ID if needed, 
            // OR we can make the backend emit to `user_${user_id}_room` since `user_id` is always available.
            // But the backend change made was `customer_${customer_id}_room`.
            // I will try to fetch the customer ID if possible, or just emit to the room if I can get the ID.
            // Actually, `CustomerDashboard` fetches it. `CustomerLayout` wraps it.
            // Let's duplicate the fetch or better yet, assume `user` has what we need or fetch it once.
            // For now, I'll add the useEffect to join if `user` exists, but we might need to fetch the customer ID.

            // Plan B: Use a global socket context or just fetch it here quickly.
        }
    }, [user]);

    // Let's implement the fetching here to be safe
    useEffect(() => {
        const joinRoom = async () => {
            if (!user?.user_id) return;
            try {
                // We need customer_id. The user object usually has `role: "customer"`.
                // Let's fetch the customer profile.
                const response = await fetch(`https://delivery-management-system-backend-2385.onrender.com/api/customers/user/${user.user_id}`);
                const data = await response.json();
                if (data.customer_id) {
                    socket.emit("join_customer_room", data.customer_id);
                    console.log("Joined room for customer:", data.customer_id);
                }
            } catch (err) {
                console.error("Failed to join notification room:", err);
            }
        };
        joinRoom();

        socket.on("order_status_updated", (data) => {
            toast.success(data.message, { duration: 5000, position: "top-right", icon: "🔔" });
        });

        return () => {
            socket.off("order_status_updated");
        };
    }, [user]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Toaster />
            {/* Sidebar - Mobile Overlay & Desktop Fixed */}
            <CustomerSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
                {/* Navbar */}
                <CustomerNavbar onMenuClick={toggleSidebar} />

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
