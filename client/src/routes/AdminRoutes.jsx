// src/routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageCustomers from "../pages/admin/ManageCustomers";
import ManageDrivers from "../pages/admin/ManageDrivers";
import ManageVehicles from "../pages/admin/ManageVehicles";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageInvoices from "../pages/admin/ManageInvoices";
import NotFound from "../pages/notfound";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout> </AdminLayout>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="managecustomers" element={<ManageCustomers />} />
        <Route path="managedrivers" element={<ManageDrivers />} />
        <Route path="managevehicles" element={<ManageVehicles />} />
        <Route path="manageorders" element={<ManageOrders />} />
        <Route path="manageinvoices" element={<ManageInvoices />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
