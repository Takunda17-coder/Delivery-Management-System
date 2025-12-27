// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import ManageCustomers from "./pages/Admin/ManageCustomers";
import ManageDrivers from "./pages/Admin/ManageDrivers";
import ManageVehicles from "./pages/Admin/ManageVehicles";
import ManageDevices from "./pages/Admin/ManageDevices";
import ManageOrders from "./pages/Admin/ManageOrders";
import ManageInvoices from "./pages/Admin/ManageInvoices";
import ManageDeliveries from "./pages/Admin/ManageDeliveries";
import DeliveryDetails from "./pages/DeliveryDetails";


// Driver
import DriverDashboard from "./pages/Driver/DriverDashboard";
import DriverDeliveries from "./pages/Driver/DriverDeliveries";

// Customer
import CustomerDashboard from "./pages/Customers/CustomerDashboard";
import Orders from "./pages/Customers/CustomerOrders";
import CustomerDeliveries from "./pages/Customers/CustomerDeliveries";
import CustomerProfile from "./pages/Customers/CustomerProfile"; // Import Profile

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
            path="/admin/managedevices"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageDevices />
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


          <Route
            path="/delivery/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "driver", "customer"]}>
                <DeliveryDetails />
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
          <Route
            path="/customer/deliveries"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDeliveries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerProfile />
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
