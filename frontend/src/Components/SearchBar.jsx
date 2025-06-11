import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm w-full max-w-8/10">
      <FaSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 bg-transparent outline-none text-gray-800"
      />
      {/* <button className="text-gray-500 hover:text-black">🔍</button> */}
      <button className="border-l-2 px-4 text-gray-600 border-black/40 text-base">
        <FaFilter className="inline text-gray-400" /> Filter
      </button>
    </div>
  );
};

export default SearchBar;
