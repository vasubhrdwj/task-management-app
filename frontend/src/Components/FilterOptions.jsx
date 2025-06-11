import React from "react";

const FilterOptions = ({ handleSort, setShowFilterOptions }) => {
  return (
    <div className="absolute mt-2 right-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-800"> Sort By</p>
        <button
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
          onClick={() => setShowFilterOptions(false)}
        >
          ✖
        </button>
      </div>

      {/* Due Date */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">📅 Due Date</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort("due_date")}
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:shadow transition"
          >
            ↑ Ascending
          </button>
          <button
            onClick={() => handleSort("due_date", true)}
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:shadow transition"
          >
            ↓ Descending
          </button>
        </div>
      </div>

      {/* Priority */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">🚨 Priority</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort("priority", true)}
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-yellow-50 hover:shadow transition"
          >
            🔽 Low → High
          </button>
          <button
            onClick={() => handleSort("priority")}
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-yellow-50 hover:shadow transition"
          >
            🔼 High → Low
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">📌 Status</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort("status", true)}
            className="flex-1 px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:shadow transition"
          >
            ✅ Done
          </button>
          <button
            onClick={() => handleSort("status")}
            className="flex-1 px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 hover:shadow transition"
          >
            🕗 Ongoing
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;
