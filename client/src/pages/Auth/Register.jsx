import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import BackgroundVideo from "../../assets/Login.mp4";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        role: formData.role,
      });

      if (response.status === 201 || response.data.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      // Axios error handling
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source src={BackgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Register Card */}
      <div className="relative z-20 bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4 font-heading">
          Create an Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Fill in your details to get started
        </p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-400" : "bg-deep-orange hover:bg-orange-700"
              } text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02]`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-deep-orange font-bold hover:text-orange-800 hover:underline cursor-pointer transition"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
