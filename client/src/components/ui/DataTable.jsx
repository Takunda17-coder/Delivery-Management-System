// src/components/DataTable.jsx
import React from "react";

const DataTable = ({ title, data, columns, renderRow }) => (
  <div className="p-4 rounded-lg shadow-lg overflow-x-auto bg-gray-800">
    <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="border-b border-gray-600 p-2 text-gray-300">
              {col.replace("_", " ").toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} className="hover:bg-gray-700 text-white">
            {renderRow(item).map((val, i) => (
              <td key={i} className="border-b border-gray-600 p-2">
                {val ?? "N/A"}
              </td>
            ))}
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="text-center p-4 text-gray-400">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
