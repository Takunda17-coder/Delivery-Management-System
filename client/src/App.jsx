// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import ManageCustomers from "./pages/admin/ManageCustomers";
import ManageDrivers from "./pages/admin/ManageDrivers";
import ManageVehicles from "./pages/admin/ManageVehicles";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageInvoices from "./pages/admin/ManageInvoices";
import ManageDeliveries from "./pages/admin/ManageDeliveries";


// Driver
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverDeliveries from "./pages/driver/DriverDeliveries";

// Customer
import CustomerDashboard from "./pages/customers/CustomerDashboard";
import Orders from "./pages/customers/Orders";

// Not Found
import NotFound from "./pages/notfound";


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/managecustomers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/managedrivers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageDrivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/managevehicles"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageVehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manageorders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manageinvoices"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageInvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admindeliveries"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageDeliveries />
              </ProtectedRoute>
            }
          />
                

          {/* Driver routes */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/deliveries"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <DriverDeliveries />
              </ProtectedRoute>
            }
          />

          {/* Customer routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
