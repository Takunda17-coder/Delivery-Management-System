// src/components/OrdersChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const OrdersChart = ({ data }) => (
  <div className="p-6 rounded-lg shadow-lg bg-gray-800">
    <h2 className="text-xl font-semibold mb-4 text-white">Orders Trend</h2>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="date" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", border: "none" }} />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default OrdersChart;
