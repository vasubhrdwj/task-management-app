import React, { useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import TasksPane from "../Components/TasksPane.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import UsersPane from "../Components/UsersPane.jsx";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);

  const [currentDisplay, setCurrentDisplay] = useState("profile");

  const adminPrivilege = user && user.is_admin;

  // Invalid Login

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const renderContent = () => {
    switch (currentDisplay) {
      case "profile":
        return <UsersPane user={user} />;
      case "viewTasks":
        return <TasksPane />;
      default:
        return <div>No content</div>;
    }
  };
  return (
    <div className="h-screen bg-neutral-100 w-screen p-6 flex">
      <div className="flex-1">
        <Sidebar
          adminPrivilege={adminPrivilege}
          setCurrentDisplay={setCurrentDisplay}
        />
      </div>
      <div className="basis-4/5 px-12 py-2">{user && renderContent()}</div>
    </div>
  );
};

export default Dashboard;
