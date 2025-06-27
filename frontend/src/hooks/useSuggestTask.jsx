import { useQuery } from "@tanstack/react-query";
import api from "../api";
import authHeader from "./authHeader";

export function useSuggestTask() {
  return useQuery({
    queryKey: ["suggest_task"],
    queryFn: async () => {
      const response = await api.get(
        "/tasks/suggest_task/",

        {
          headers: authHeader(),
        }
      );
      return response.data;
    },
    enabled: false
  });
}
