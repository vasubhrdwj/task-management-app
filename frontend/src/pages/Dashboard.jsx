import React, { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Please Login!</div>;
  }
  return <div>Welcome {user.full_name}!</div>;
};

export default Dashboard;
