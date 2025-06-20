import { useQuery } from "@tanstack/react-query";
import api from "../api";
import authHeader from "./authHeader";

/**
 * Fetches tasks, optionally with sorting params.
 * @param {{ sort_by?: string; sort_desc?: boolean } | null} params
 */

export function useTasks({ user_mail, sortParams }) {
  return useQuery({
    queryKey: ["tasks", user_mail, sortParams],
    queryFn: async () => {
      const response = await api.get(
        "/tasks",

        {
          params: { user_mail, ...sortParams },
          headers: authHeader(),
        }
      );
      return response.data;
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
