import React, { useEffect, useState } from "react";
import axios from "axios";
import SummaryCard from "../../components/ui/SummaryCard";
import DataTable from "../../components/ui/DataTable";
import OrdersChart from "../../components/ui/OrdersChart";
import DriversChart from "../../components/ui/DriversChart";
import AdminLayout from "../../components/AdminLayout";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ordersRes, driversRes, deliveriesRes] = await Promise.all([
          axios.get("/api/orders"),
          axios.get("/api/drivers"),
          axios.get("/api/deliveries"),
        ]);

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setDrivers(Array.isArray(driversRes.data) ? driversRes.data : []);
        setDeliveries(Array.isArray(deliveriesRes.data) ? deliveriesRes.data : []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-gray-900 p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  // Derived stats
  const unattendedOrders = orders.filter((o) => o.status === "unattended");
  const inRouteDeliveries = deliveries.filter((d) => d.status === "in-route");
  const unassignedDeliveries = deliveries.filter((d) => !d.driver_id);
  const freeDrivers = drivers.filter((d) => d.status === "active");

  // Graph data
  const ordersTrendData = Object.entries(
    orders.reduce((acc, order) => {
      const date = new Date(order.order_date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count }));

  const driverStatusData = [
    { name: "Active", value: freeDrivers.length },
    { name: "Inactive", value: drivers.length - freeDrivers.length },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-gray-900 text-3xl font-bold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Orders" value={orders.length} color="blue" />
          <SummaryCard title="Unattended Orders" value={unattendedOrders.length} color="red" />
          <SummaryCard title="Deliveries In Route" value={inRouteDeliveries.length} color="yellow" />
          <SummaryCard title="Free Drivers" value={freeDrivers.length} color="green" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrdersChart data={ordersTrendData} />
          <DriversChart data={driverStatusData} />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DataTable
            title="Unattended Orders"
            data={unattendedOrders}
            columns={["order_id", "customer", "order_item", "quantity"]}
            renderRow={(o) => [
              o.order_id,
              o.customer ? `${o.customer.first_name} ${o.customer.last_name}` : "N/A",
              o.order_item,
              o.quantity,
            ]}
          />
          <DataTable
            title="Unassigned Deliveries"
            data={unassignedDeliveries}
            columns={["delivery_id", "order_id", "destination"]}
            renderRow={(d) => [d.delivery_id, d.order_id, d.destination]}
          />
          <DataTable
            title="Free Drivers"
            data={freeDrivers}
            columns={["driver_id", "name", "phone_number"]}
            renderRow={(d) => [d.driver_id, `${d.first_name} ${d.last_name}`, d.phone_number]}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
