import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import authHeader from "./authHeader";

const useUpdateTask = ({ user_mail, sortParams }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }) => {
      const response = await api.patch(`/tasks/update/${taskId}`, updates, {
        headers: authHeader(),
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", user_mail, sortParams],
        exact: false,
      });
    },
  });
};

export default useUpdateTask;
