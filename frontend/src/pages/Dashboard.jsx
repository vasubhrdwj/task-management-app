import React, { useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import TaskCard from "../Components/TaskCard";
import { useTasks, useUsers } from "../hooks/useApi";
import FilterOptions from "../Components/FilterOptions.jsx";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);

  // const [userList, setUserList] = useState([]);
  const [sortParams, setSortParams] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks(user && initialized ? sortParams : null);

  const handleSort = (sort_by, sort_desc = "false") => {
    setSortParams({ sort_by, sort_desc });
  };

  // const {
  //   data: userList,
  //   isLoading: usersLoading,
  //   error: usersError,
  // } = useUsers(user && initialized);

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen bg-neutral-100 w-screen">
      <div className="absolute right-10">
        <div className="font-medium">{user.email}</div>
        <div>{user.full_name}</div>
      </div>
      <div className="flex h-9/10">
        {/* Tasks Display */}
        <div className="basis-4/5  p-10">
          <div className="pl-4 pr-6 flex justify-between mb-10">
            <h1 className="font-bold text-2xl">Tasks:</h1>
            <div className="place-self-end">
              <button
                onClick={() => setShowFilterOptions(true)}
                className="mb-1"
              >
                Filter
              </button>
              {showFilterOptions && (
                <FilterOptions
                  handleSort={handleSort}
                  setShowFilterOptions={setShowFilterOptions}
                />
              )}
            </div>
          </div>
          {tasksLoading && <div>Loading tasks…</div>}
          {tasksError && <div className="text-red-600">{tasksError}</div>}
          {!tasksLoading && !tasksError && tasks.length === 0 && (
            <div>No tasks to show.</div>
          )}

          {!tasksLoading && !tasksError && tasks.length > 0 && (
            <ul className="space-y-6 flex gap-6 justify-around p-6">
              {tasks.map((t) => (
                <li key={t.id}>
                  <TaskCard task={t} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
