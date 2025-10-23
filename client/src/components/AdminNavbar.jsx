import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="fixed top-0 bg-gray-900 left-60 right-0 px-6 py-3 flex justify-between items-center shadow-lg z-50"
      style={{ width: "calc(100% - 15rem)" }} // 15rem = 60 Tailwind units
    >
      <div
        className="text-md font-semibold cursor-pointer"
        onClick={() => navigate("/admin/dashboard")}
      >
        {/* Delivery Management Admin */}
      </div>

      <div className="flex gap-6 items-center">
        <span className="hidden sm:inline">Admin Panel</span>
        <button
          onClick={handleLogout}
          className="bg-white text-black px-3 py-1 rounded font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
