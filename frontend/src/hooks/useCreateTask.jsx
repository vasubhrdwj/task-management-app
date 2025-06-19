import { useQueryClient, useMutation } from "@tanstack/react-query";
import React from "react";
import authHeader from "./authHeader";
import api from "../api";

const useCreateTask = (sortParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ updates: task, user_mail_list: email_ids }) => {
      const response = await api.post(
        `/tasks/create/`,
        { task, email_ids },
        {
          headers: authHeader(),
        }
      );

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
