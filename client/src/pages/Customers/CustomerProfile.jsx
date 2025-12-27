import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import { User, Mail, Phone, MapPin, Save, Trash2, Calendar, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CustomerProfile() {
    const { user, logout } = useAuth(); // Get logged-in user context
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        age: "",
        sex: "",
        password: "", // Optional
    });

    // Fetch Full Customer Profile using User ID
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user?.user_id) return;
                const res = await api.get(`/customers/user/${user.user_id}`);
                setProfile(res.data);

                // Pre-fill form
                setForm({
                    first_name: res.data.first_name || "",
                    last_name: res.data.last_name || "",
                    email: res.data.email || "",
                    phone_number: res.data.phone_number || "",
                    address: res.data.address || "",
                    age: res.data.age || "",
                    sex: res.data.sex || "",
                    password: "",
                });
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                toast.error("Could not load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    // Handle Input Change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!profile) return;

        try {
            setSubmitting(true);
            const updateData = { ...form };
            if (!updateData.password) delete updateData.password; // Don't send empty password

            await api.put(`/customers/${profile.customer_id}`, updateData);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            toast.error(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Account Deletion
    const handleDeleteAccount = async () => {
        if (!window.confirm("ARE YOU SURE? This will permanently delete your account and all order history. This action cannot be undone.")) {
            return;
        }

        try {
            await api.delete(`/customers/${profile.customer_id}`);
            toast.success("Account deleted. Goodbye!");
            logout(); // Log out frontend
            navigate("/login");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete account. Please contact support.");
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
                <p className="text-gray-500 mt-2">Manage your personal information and account settings.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Profile Form */}
                <form onSubmit={handleUpdate} className="p-8 space-y-6">

                    {/* Section: Personal Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <User size={20} className="text-deep-orange" /> Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Age</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="age"
                                        type="number"
                                        value={form.age}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    name="sex"
                                    value={form.sex}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Section: Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Phone size={20} className="text-deep-orange" /> Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="phone_number"
                                        value={form.phone_number}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Section: Security */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Lock size={20} className="text-deep-orange" /> Security
                        </h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">New Password (Leave blank to keep current)</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-orange/20 focus:border-deep-orange outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 bg-deep-orange text-white rounded-xl font-semibold shadow-lg shadow-deep-orange/20 hover:bg-orange-700 hover:shadow-xl active:scale-95 transition-all disabled:opacity-70"
                        >
                            {submitting ? "Saving..." : <><Save size={20} /> Save Changes</>}
                        </button>
                    </div>
                </form>

                {/* Danger Zone */}
                <div className="bg-red-50 p-8 border-t border-red-100">
                    <h3 className="text-red-800 font-bold mb-2">Danger Zone</h3>
                    <p className="text-red-600 text-sm mb-4">Deleting your account is permanent. All your data and order history will be wiped.</p>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
                    >
                        <Trash2 size={16} /> Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
}
