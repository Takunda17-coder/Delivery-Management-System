import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import { User, Mail, Phone, Lock, Save, Trash2, Truck, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DriverLayout from "../../components/DriverLayout";

export default function DriverProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [form, setForm] = useState({
        name: "", // Read-only mostly from User
        email: "",
        phone_number: "",
        license_number: "",
        vehicle_status: "Active", // Enum or text
        password: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user?.user_id) return;
                // Fetch Driver-specific data (linked to User)
                const res = await api.get(`/drivers/user/${user.user_id}`);
                // Response should include driver details AND user details (usually joined in backend)
                const driver = res.data;
                setProfile(driver);

                setForm({
                    first_name: driver.first_name || "",
                    last_name: driver.last_name || "",
                    email: driver.user?.email || driver.email || "", // Email might be on User or Driver model depending on schema
                    phone_number: driver.phone_number || "",
                    license_number: driver.license_number || "",
                    vehicle_status: driver.vehicle_status || "Active",
                    password: "",
                });
            } catch (err) {
                console.error("Failed to fetch driver profile:", err);
                // Fallback or user might just be a user without driver row yet?
                // But role check should prevent this page if not driver.
                toast.error("Could not load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!profile) return;

        try {
            setSubmitting(true);
            const updateData = { ...form };
            if (!updateData.password) delete updateData.password;

            // We might need to update USER (for email/password) and DRIVER (for phone/license)
            // The backend 'updateDriver' usually handles this if designed well, 
            // or we might need separate calls if strict separation.
            // Assuming GET /drivers/:id returns driver object with user_id, 
            // and PUT /drivers/:id updates driver (and ideally user fields if passed).
            // Let's assume standard PUT /drivers/:id logic:

            await api.put(`/drivers/${profile.driver_id}`, updateData);
            toast.success("Driver profile updated!");
        } catch (err) {
            console.error("Update failed:", err);
            toast.error(err.response?.data?.message || "Update failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("ARE YOU SURE? This will permanently delete your driver account and user login.")) {
            return;
        }
        try {
            // DELETE /drivers/:id usually cascades to User if implemented that way, 
            // OR specifically deletes driver row.
            // If we want to fully remove access, we delete the Driver. 
            // The backend should ideally also remove the User or at least the role.
            await api.delete(`/drivers/${profile.driver_id}`);
            toast.success("Account deleted.");
            logout();
            navigate("/login");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Delete failed.");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <DriverLayout>
            <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your driver details and account credentials.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleUpdate} className="p-8 space-y-6">

                        {/* Personal & Driver Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <User size={20} className="text-deep-orange" /> Driver Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">License Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="license_number" value={form.license_number} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" placeholder="e.g. DL-123456" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Vehicle Status</label>
                                    <div className="relative">
                                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <select name="vehicle_status" value={form.vehicle_status} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none">
                                            <option value="Active">Active</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Contact & Security */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Lock size={20} className="text-deep-orange" /> Contact & Security
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-deep-orange outline-none" />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
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
                        <p className="text-red-600 text-sm mb-4">Permanently delete your driver account.</p>
                        <button onClick={handleDeleteAccount} className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition font-medium text-sm">
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
