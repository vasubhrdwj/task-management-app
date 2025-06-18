import React, { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import TasksPane from "../Components/TasksPane.jsx";
import Sidebar from "../Components/Sidebar.jsx";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);

  const adminPrivilege = user && user.is_admin;

  // Invalid Login

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen bg-neutral-100 w-screen p-6 flex">
      <div className="flex-1">
        <Sidebar adminPrivilege={adminPrivilege} />
      </div>
      <div className="basis-4/5 px-12 py-2">
        <TasksPane />
      </div>
    </div>
  );
};

export default Dashboard;
