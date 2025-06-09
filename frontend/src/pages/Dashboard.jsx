import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import api from "../api";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [user]);

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
        <div className="basis-1/5 bg-amber-50 border-t-4 border-gray-600"></div>
        <div className="basis-4/5 bg-gray-50 p-10">
          <h1 className="font-bold text-2xl">Tasks:</h1>
          {loading && <div>Loading tasks…</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && tasks.length === 0 && (
            <div>No tasks to show.</div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <ul className="space-y-4">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                >
                  {/* Left: Description & Title */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {t.title}
                    </h3>
                    <p className="text-gray-600">{t.description}</p>
                  </div>

                  {/* Right: Priority & Status */}
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    {/* Priority badge */}
                    <span
                      className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${
              t.priority === "high"
                ? "bg-red-100 text-red-800"
                : t.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }
          `}
                    >
                      {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                    </span>

                    {/* Completion */}
                    <span className="flex items-center space-x-1">
                      {t.is_complete ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <span className="text-sm text-gray-700">
                        {t.is_complete ? "Done" : "Pending"}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Welcome {user.full_name}! */}
    </div>
  );
};

export default Dashboard;
