import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import BackgroundVideo from "../../assets/Login.mp4";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Save token and user in context or localStorage
      login({ token, user });

      // Redirect based on role
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "driver") navigate("/driver/dashboard");
      else if (user.role === "customer") navigate("/customer/dashboard");
      else navigate("/login");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
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

      {/* Login Card */}
      <div className="relative z-20 bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6 font-heading">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to your account to continue
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-deep-orange focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-deep-orange hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-deep-orange font-bold hover:text-orange-800 hover:underline cursor-pointer transition"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
