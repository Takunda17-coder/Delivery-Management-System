import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import { User, Mail, Lock, Save, Trash2, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { TAILWIND_CLASSES } from "../../styles/designSystem";

export default function AdminProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                if (!user?.user_id) return;
                // Admins are just 'Users' with role='admin'
                // So we fetch directly from Users endpoint
                const res = await api.get(`/users/${user.user_id}`);
                setForm({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    password: "",
                });
            } catch (err) {
                console.error("Failed to load admin profile:", err);
                toast.error("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const updateData = { ...form };
            if (!updateData.password) delete updateData.password;

            await api.put(`/users/${user.user_id}`, updateData);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            toast.error("Update failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("ARE YOU SURE? This will permanently delete your admin account.")) {
            return;
        }
        try {
            await api.delete(`/users/${user.user_id}`);
            logout();
            navigate("/login");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete account.");
        }
    };

    if (loading) return <AdminLayout><div className="p-10 text-center">Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className={TAILWIND_CLASSES.contentContainer}>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your administrative credentials.</p>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden max-w-2xl">
                    <form onSubmit={handleUpdate} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Shield size={20} className="text-deep-orange" /> Account Details
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="name" value={form.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-deep-orange text-white rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition disabled:opacity-70">
                                {submitting ? "Saving..." : <><Save size={20} /> Save Changes</>}
                            </button>
                        </div>
                    </form>

                    <div className="bg-red-50 p-8 border-t border-red-100">
                        <h3 className="text-red-800 font-bold mb-2">Danger Zone</h3>
                        <p className="text-red-600 text-sm mb-4">Deleting your admin account is permanent.</p>
                        <button onClick={handleDeleteAccount} className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition font-medium text-sm">
                            <Trash2 size={16} /> Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
