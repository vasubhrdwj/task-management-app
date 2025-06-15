import { useQuery } from "@tanstack/react-query";
import api from "../api";
import authHeader from "./authHeader";

/**
 * Fetches tasks, optionally with sorting params.
 * @param {{ sort_by?: string; sort_desc?: boolean } | null} params
 */

export function useTasks(params) {
  return useQuery({
    queryKey: ["tasks", params],
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
