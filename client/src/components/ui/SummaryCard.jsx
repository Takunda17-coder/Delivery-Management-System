// src/components/SummaryCard.jsx
import React from "react";

const SummaryCard = ({ title, value, color }) => {
  const colorMap = {
    blue: "bg-blue-600",
    red: "bg-red-600",
    green: "bg-green-600",
    yellow: "bg-yellow-600",
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${colorMap[color] || "bg-gray-700"} text-white flex flex-col justify-center items-center`}
    >
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default SummaryCard;
