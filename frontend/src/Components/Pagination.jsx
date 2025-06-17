import React from "react";

const Pagination = ({ tasksPerPage, totalTasks, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTasks / tasksPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav aria-label="Pagination Navigation" className="mt-4">
      <ul className="inline-flex items-center space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => {
                paginate(number);
              }}
              className={`px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                ${
                  currentPage === number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
