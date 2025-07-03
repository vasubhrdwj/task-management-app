import React, { useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import TasksPane from "../Components/TasksPane.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import ProfilePane from "../Components/ProfilePane.jsx";
import UsersPane from "../Components/UsersPane.jsx";
import LogsPane from "../Components/LogsPane.jsx";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);
  const [currentDisplay, setCurrentDisplay] = useState("profile");
  const [displayTaskUser, setDisplayTaskUser] = useState(null);

  const adminPrivilege = user && user.is_admin;

  // Early exit if auth not ready
  if (!initialized) return null;
  // Redirect if not logged in
  if (!user) return <Navigate to="/login" />;

  const renderContent = () => {
    switch (currentDisplay) {
      case "profile":
        return <ProfilePane user={user} />;
      case "viewTasks":
        return (
          <TasksPane isAdmin={user.is_admin} displayUser={displayTaskUser} />
        );
      case "viewUsers":
        return (
          <UsersPane
            setCurrentDisplay={setCurrentDisplay}
            setDisplayTaskUser={setDisplayTaskUser}
          />
        );
      case "viewLogs":
        return <LogsPane />;
      default:
        return <div className="text-gray-400">No content</div>;
    }
  };

  return (
    <div className="h-screen w-screen p-4 flex bg-gray-900 text-gray-100">
      <div className="flex-1">
        {user && (
          <Sidebar
            adminPrivilege={adminPrivilege}
            setCurrentDisplay={setCurrentDisplay}
          />
        )}
      </div>
      <div className="basis-4/5 overflow-auto">{user && renderContent()}</div>
    </div>
  );
};

export default Dashboard;
