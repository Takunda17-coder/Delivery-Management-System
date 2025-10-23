import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-60">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
