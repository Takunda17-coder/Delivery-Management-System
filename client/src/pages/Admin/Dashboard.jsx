import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import AdminLayout from "../../components/AdminLayout";
import { TAILWIND_CLASSES, formatCurrency, formatDate, formatDateTime } from "../../styles/designSystem";
import { StatCard, Badge, Alert } from "../../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalDeliveries: 0,
    totalDrivers: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, deliveriesRes, driversRes, customersRes] = await Promise.all([
          api.get("/orders"),
          api.get("/delivery"),
          api.get("/drivers"),
          api.get("/customers"),
        ]);

        const orders = ordersRes.data || [];
        const deliveries = deliveriesRes.data || [];
        const drivers = driversRes.data || [];
        const customers = customersRes.data || [];

        const pending = orders.filter((o) => o.status === "Pending").length;
        const onRoute = deliveries.filter((d) => d.status === "On Route").length;
        const completed = deliveries.filter((d) => d.status === "Completed").length;
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

        setStats({
          totalOrders: orders.length,
          totalDeliveries: deliveries.length,
          totalDrivers: drivers.length,
          totalCustomers: customers.length,
          pendingOrders: pending,
          activeDeliveries: onRoute,
          completedDeliveries: completed,
          revenue: totalRevenue,
        });

        setRecentOrders(orders.slice(-5).reverse());
        setRecentDeliveries(deliveries.slice(-5).reverse());
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className={TAILWIND_CLASSES.contentContainer}>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <div className="border-4 border-blue-200 border-t-blue-600 rounded-full w-12 h-12"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={TAILWIND_CLASSES.contentContainer}>
        {error && <Alert type="error" message={error} />}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" color="blue" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="orange" />
          <StatCard title="Active Deliveries" value={stats.activeDeliveries} icon="🚗" color="purple" />
          <StatCard title="Completed" value={stats.completedDeliveries} icon="✅" color="green" />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Drivers" value={stats.totalDrivers} icon="👨‍💼" color="blue" />
          <StatCard title="Total Customers" value={stats.totalCustomers} icon="👥" color="green" />
          <StatCard title="Total Deliveries" value={stats.totalDeliveries} icon="📫" color="orange" />
          <StatCard
            title="Revenue"
            value={formatCurrency(stats.revenue)}
            icon="💰"
            color="green"
          />
        </div>

        {/* Recent Orders & Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.order_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-600">{order.order_item}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                      <Badge status={order.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Deliveries */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Deliveries</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentDeliveries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No deliveries yet</p>
              ) : (
                recentDeliveries.map((delivery) => (
                  <div key={delivery.delivery_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Delivery #{delivery.delivery_id}</p>
                      <p className="text-sm text-gray-600">{delivery.pickup_address}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(delivery.delivery_date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(delivery.delivery_fee)}</p>
                      <Badge status={delivery.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
