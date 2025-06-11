import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import api from "../api";
import TaskCard from "../Components/TaskCard";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const loadTasks = async (sortParam = "", sortDesc) => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);
    setError(null);

    try {
      const resp = await api.get(
        `/tasks${
          sortParam ? `?sort_by=${sortParam}&sort_desc=${sortDesc}` : ""
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(resp.data);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (sortKey, sortDesc = "false") => {
    loadTasks(sortKey, sortDesc);
    setShowFilterOptions(false);
  };

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }
    const token = localStorage.getItem("accessToken");

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const resp = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) {
          setTasks(resp.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch tasks");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, initialized]);

  useEffect(() => {
    if (!initialized || !user) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await api.get("/users");

        if (!cancelled) {
          setUserList(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch users", err);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, initialized]);

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
          <ul>
            {userList.map((u) => (
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
          {loading && <div>Loading tasks…</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && tasks.length === 0 && (
            <div>No tasks to show.</div>
          )}

          {!loading && !error && tasks.length > 0 && (
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
            🕗 Pending
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
