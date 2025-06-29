import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import FilterOptions from "./FilterOptions";

const SearchBar = ({ query,setQuery, handleSort }) => {
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const handleSortFull = (sort_by, sort_desc = "false") => {
    handleSort(sort_by, sort_desc);
    setShowFilterOptions((prevState) => !prevState);
  };

  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm w-full max-w-6/10">
      <FaSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 bg-transparent outline-none text-gray-800"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />

      <button
        onClick={() => setShowFilterOptions(true)}
        className="border-l-2 px-5 text-gray-600 border-black/40 text-base"
      >
        <FaFilter className="inline text-gray-400" /> Filter
      </button>
      {showFilterOptions && (
        <FilterOptions
          handleSort={handleSortFull}
          setShowFilterOptions={setShowFilterOptions}
        />
      )}
    </div>
  );
};

export default SearchBar;
