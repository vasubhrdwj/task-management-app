import React from "react";
import authHeader from "./authHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId) => {
      return api.delete(`/tasks/delete/${taskId}`, { headers: authHeader() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useDeleteTask;
