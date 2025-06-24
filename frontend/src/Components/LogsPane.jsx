import React from "react";
import useLogs from "../hooks/useLogs";
import api from "../api";
import authHeader from "../hooks/authHeader";

const getEmail = async (id) => {
  const response = await api.get(`/users/byid/${id}`, {
    headers: authHeader(),
  });
  return response.data.email;
};

const LogsPane = () => {
  const { data, isFetching, isError } = useLogs();

  return (
    <div className="max-w-xl mx-auto">
      {isFetching && <p className="text-base text-gray-600">Loading logs…</p>}
      {isError && (
        <p className="text-base text-red-600">Error while fetching logs</p>
      )}

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {data?.map((log) => {
          const { data: adminEmail } = getEmail(log.admin_user_id);
          return (
            <li key={log.id} className="bg-white">
              {expandLog({ log, adminEmail })}
            </li>
          );
        })}

        {!isFetching && !data?.length && (
          <li className="p-4 text-center text-gray-500">No logs found.</li>
        )}
      </ul>
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

function expandLog({ log, adminEmail }) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{actionLabels[log.action]}</span>
        <span className="text-sm text-gray-500">
          {formatTimestamp(log.created_at)}
        </span>
      </div>

      <div className="text-sm mb-2">
        <strong>Admin ID:</strong> {adminEmail}
      </div>

      <div className="text-sm mb-1">
        <strong>Task:</strong>{" "}
        {log.task
          ? `${log.task.title} (#${log.task.id})`
          : "Task removed or no longer available"}
      </div>

      {log.targets?.length > 0 && (
        <div className="text-sm">
          <strong>Affected user{log.targets.length > 1 ? "s" : ""}:</strong>{" "}
          {log.targets.map((t) => t.user.email).join(", ")}
        </div>
      )}
    </div>
  );
}

export default LogsPane;
