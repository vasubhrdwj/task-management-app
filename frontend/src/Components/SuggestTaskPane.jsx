import React from "react";
import { useSuggestTask } from "../hooks/useSuggestTask";

const SuggestTaskPane = () => {
  const { data: suggestion, isFetching, isError, refetch } = useSuggestTask();
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isFetching ? "Loading…" : "Suggest Task"}
      </button>

      {isError && (
        <p className="text-red-600">Error fetching suggestion. Try again.</p>
      )}

      {suggestion && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">{suggestion.title}</h3>
          <p>{suggestion.description}</p>
          <div className="text-sm text-gray-500">
            Due: {suggestion.deadline} • Priority: {suggestion.priority}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestTaskPane;
