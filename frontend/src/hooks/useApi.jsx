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
  return useQuery({
    // queryKey
    queryKey: ["tasks", params],
    // queryFn
    queryFn: async () => {
      const response = await api.get("/tasks", {
        params,
        headers: authHeader(),
      });
      return await response.data;
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return await response.data;
    },
  });
}
