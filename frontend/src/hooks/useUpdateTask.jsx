import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import authHeader from "./authHeader";

const useUpdateTask = ({ params }) => {
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
        queryKey: ["tasks", params],
        exact: false,
      });
    },
  });
};

export default useUpdateTask;
