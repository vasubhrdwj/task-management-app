import React from "react";
import authHeader from "./authHeader";
import { useMutation } from "@tanstack/react-query";
import api from "../api";

const useDeleteTask = () => {
  return useMutation({
    mutationFn: (taskId) => {
      return api.delete(`/tasks/delete/${taskId}`, { headers: authHeader() });
    },
  });
};

export default useDeleteTask;
