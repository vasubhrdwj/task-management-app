import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import TaskCard from "../Components/TaskCard";
import { useTasks } from "../hooks/useApi";

import Sidebar from "../Components/Sidebar.jsx";
import SearchBar from "../Components/SearchBar.jsx";
import useCreateTask from "../hooks/useCreateTask.jsx";
import TaskForm from "../Components/TaskForm.jsx";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);

  const [sortParams, setSortParams] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  const { mutate: createTask, isLoading: creating } = useCreateTask(sortParams);

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks(user && initialized ? sortParams : null);

  // Fetching current Page Tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleSort = (sort_by, sort_desc = false) => {
    setSortParams({ sort_by, sort_desc });
  };

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen bg-neutral-100 w-screen p-6 flex">
      <div className="flex-1">
        <Sidebar />
      </div>
      <div className="basis-4/5 px-12 py-2">
        <SearchBar handleSort={handleSort} />
        <div className="tasks flex-4">
          {/* Tasks Display */}
          <div className="py-6">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-3xl">Tasks:</h1>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-gray-700 p-2 px-3 text-center text-white font-semibold rounded-lg text-lg hover:bg-gray-900"
              >
                + Add Task
              </button>
            </div>

            {isAdding && (
              <TaskForm
                initialValues={{
                  title: "",
                  description: "",
                  deadline: new Date().toISOString().slice(0, 10),
                  priority: "medium",
                }}
                onSubmit={(values) => {
                  createTask({ updates: values, user_mail: user.email });
                  setIsAdding(false);
                }}
                onCancel={() => setIsAdding(false)}
                isLoading={creating}
                heading="Add New Task"
                submitLabel="Create Task"
              />
            )}

            {tasksLoading && <div>Loading tasks…</div>}
            {tasksError && <div className="text-red-600">{tasksError}</div>}
            {!tasksLoading && !tasksError && tasks.length === 0 && (
              <div>No tasks to show.</div>
            )}
            {!tasksLoading && !tasksError && tasks.length > 0 && (
              <ul className="space-y-6 flex gap-6 justify-around p-6">
                {currTasks.map((t) => (
                  <li key={t.id}>
                    <TaskCard task={t} params={sortParams} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
