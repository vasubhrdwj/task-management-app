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

  const {
    data: userList,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers(user && initialized);

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen bg-amber-950 w-screen">
      <div className="bg-amber-50 h-1/10 flex justify-center gap-15 center p-4 ">
        <div className="font-medium">{user.email}</div>
        <div>{user.full_name}</div>
        <div>{user.is_admin ? "Admin Privilege" : ""}</div>
      </div>
      <div className="flex h-9/10">
        {/* Users Display */}
        <div className="basis-1/5 bg-amber-50">
          <h3 className="font-bold text-xl m-5 mb-8">Users:</h3>
          {usersLoading && <p>Loading users...</p>}
          {usersError && <p className="text-red-600">{usersError}</p>}
          <ul>
            {userList?.map((u) => (
              <li
                key={u.email}
                className="border-1 rounded-md border-fuchsia-200 p-5 m-4 bg-fuchsia-200 text-center"
              >
                {u.full_name}
                <br />
                {u.is_admin ? "Is Admin" : "Not Admin"}
              </li>
            ))}
          </ul>
        </div>

        {/* Tasks Display */}
        <div className="basis-4/5 bg-gray-50 p-10">
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
