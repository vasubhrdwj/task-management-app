import React, { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return <div>{user === null ? "Please Login" : user}</div>;
};

export default Dashboard;
