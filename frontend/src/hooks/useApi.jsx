import { useQuery } from "@tanstack/react-query";
import api from "../api";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

/**
 * Fetches tasks, optionally with sorting params.
 * @param {{ sort_by?: string; sort_desc?: boolean } | null} params
 */

export function useTasks(params) {
  return useQuery(
    // queryKey
    ["tasks", params],
    // queryFn
    () =>
      api
        .get("/tasks", { params, headers: authHeader() })
        .then((res) => res.data),

    {
      enabled: params !== null,
    }
  );
}
