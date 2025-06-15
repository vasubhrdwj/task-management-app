import { useQueryClient, useMutation } from "@tanstack/react-query";
import React from "react";
import authHeader from "./authHeader";
import api from "../api";

const useCreateTask = (sortParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ updates, user_mail }) => {
      const response = await api.post(`/tasks/create/${user_mail}`, updates, {
        headers: authHeader(),
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", sortParams],
        exact: false,
      });
    },
  });
};

export default useCreateTask;
