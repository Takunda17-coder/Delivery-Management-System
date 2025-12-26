import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";

export default function AdminNavbar({ onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 bg-deep-orange h-16 px-6 flex items-center justify-between shadow-md z-30 transition-all duration-300">
      {/* Left Side: Menu Button (Mobile) & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-white hover:bg-white/20 p-2 rounded-lg transition"
        >
          <Menu size={24} />
        </button>

      </div>

      {/* Right Side: Profile / Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end text-white text-sm">
          <span className="font-semibold opacity-90">Administrator</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
        >
          <span className="text-sm font-medium">Logout</span>
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
