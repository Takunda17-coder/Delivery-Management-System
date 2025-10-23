// src/components/DriversChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const DriversChart = ({ data }) => {
  const COLORS = ["#22c55e", "#f43f5e"]; // green = active, red = inactive

  return (
    <div className="p-6 rounded-lg shadow-lg bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Driver Status</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DriversChart;
