import { useState, useMemo } from "react";
import useLogs from "../hooks/useLogs";
import Pagination from "./Pagination";
import { useQueries } from "@tanstack/react-query";
import api from "../api";
import authHeader from "../hooks/authHeader";

const LogsPane = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;

  const { data: logs = [], isFetching, isError } = useLogs();

  const adminIds = useMemo(
    () => Array.from(new Set(logs.map((l) => l.admin_user_id))),
    [logs]
  );

  const emailQueries = useQueries({
    queries: adminIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: async () => {
        const response = await api.get(`/users/byid/${id}`, {
          headers: authHeader(),
        });

        return response.data;
      },
      enabled: logs.length > 0,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const adminEmailMap = useMemo(() => {
    const map = {};
    emailQueries.forEach((q, idx) => {
      const id = adminIds[idx];
      if (q.isSuccess && q.data?.email) {
        map[id] = q.data.email;
      }
    });
    return map;
  }, [emailQueries, adminIds]);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currLogs =
    !isFetching && logs ? logs.slice(indexOfFirstLog, indexOfLastLog) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-xl mx-auto text-gray-100">
      {isFetching && <p className="text-base text-gray-400">Loading logs…</p>}
      {isError && (
        <p className="text-base text-red-500">Error while fetching logs</p>
      )}

      <ul className="divide-y divide-gray-700 border border-gray-700 rounded-lg overflow-hidden">
        {currLogs?.map((log) => {
          const email = adminEmailMap[log.admin_user_id] || log.admin_user_id;
          return (
            <li key={log.id} className="bg-gray-800">
              {expandLog({ log, email })}
            </li>
          );
        })}
        {!isFetching && !logs?.length && (
          <li className="p-4 text-center text-gray-500">No logs found.</li>
        )}
      </ul>
      {logs && (
        <div className="flex justify-center mt-4">
          <Pagination
            itemsPerPage={logsPerPage}
            totalItems={logs.length}
            paginate={paginate}
            currentPage={currentPage}
            className="text-gray-100"
          />
        </div>
      )}
    </div>
  );
};

const actionLabels = {
  CREATE_TASK: "Created a new task",
  UPDATE_TASK: "Updated a task",
  DELETE_TASK: "Deleted a task",
};

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function expandLog({ log, email }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-200">
          {actionLabels[log.action]}
        </span>
        <span className="text-sm text-gray-400">
          {formatTimestamp(log.created_at)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between">
        <div className="text-sm mb-1 text-gray-300">
          <strong>Task:</strong>{" "}
          {log.task
            ? `${log.task.title} (#${log.task.id})`
            : "Task removed or no longer available"}
        </div>
        <div className="text-sm mb-2 text-gray-300">
          <strong>Admin:</strong> {email}
        </div>
      </div>

      {log.targets?.length > 0 && (
        <div className="text-sm text-gray-300">
          <strong>Affected user{log.targets.length > 1 ? "s" : ""}:</strong>{" "}
          {log.targets.map((t) => t.user.email).join(", ")}
        </div>
      )}
    </div>
  );
}

export default LogsPane;
