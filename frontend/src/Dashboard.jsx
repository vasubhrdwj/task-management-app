import React, { useContext } from "react";
import { AuthContext } from "./pages/contexts/AuthContext";

const Dashboard = () => {
  const { accessToken } = useContext(AuthContext);
  return <div>{accessToken === null ? "Please Login" : accessToken}</div>;
};

export default Dashboard;
