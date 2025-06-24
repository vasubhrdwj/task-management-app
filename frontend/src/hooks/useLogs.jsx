import { useQuery } from "@tanstack/react-query";
import React from "react";
import api from "../api";
import authHeader from "./authHeader";

const useLogs = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const response = await api.get("/logs/", { headers: authHeader() });
      return response.data;
    },
  });
};

export default useLogs;
