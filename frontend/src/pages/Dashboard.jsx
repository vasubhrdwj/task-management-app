import React, { useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import TasksPane from "../Components/TasksPane.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import ProfilePane from "../Components/ProfilePane.jsx";
import UsersPane from "../Components/UsersPane.jsx";

const Dashboard = () => {
  const { user, initialized } = useContext(AuthContext);

  const [currentDisplay, setCurrentDisplay] = useState("profile");
  const [displayTaskUser, setDisplayTaskUser] = useState(null);

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

      default:
        return <div>No content</div>;
    }
  };
  
  return (
    <div className="h-screen bg-gray-200 w-screen p-4 flex">
      <div className="flex-1">
        {user && (
          <Sidebar
            adminPrivilege={adminPrivilege}
            setCurrentDisplay={setCurrentDisplay}
          />
        )}
      </div>
      <div className="basis-4/5">{user && renderContent()}</div>
    </div>
  );
};

export default Dashboard;
