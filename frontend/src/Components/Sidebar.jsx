import React, { useContext } from "react";
import { FaTasks, FaUsers } from "react-icons/fa";
import { CgProfile, CgLogOut, CgViewList } from "react-icons/cg";
import { AuthContext } from "../pages/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ adminPrivilege, setCurrentDisplay }) => {
  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAccessToken(null);
    navigate("/login");
  };

  return (
    <div className="w-9/10 h-full bg-black rounded-2xl p-4 text-slate-500">
      <div className="flex items-center gap-2 text-white px-1 pt-4 pb-10 border-b border-white/30 justify-center">
        <FaTasks size={20} className="text-white " />
        <span className="text-xl font-bold ">TaskManager</span>
      </div>
      <div className="py-6">
        <span className="text-sm">
          {adminPrivilege ? "Admin Profile" : "Profile"}
        </span>
        <ul className="py-3 space-y-2">
          <li
            onClick={() => setCurrentDisplay("profile")}
            className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1"
          >
            <CgProfile className="inline" />
            View Profile
          </li>
          <li
            onClick={() => handleLogout()}
            className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1"
          >
            <CgLogOut className="inline" />
            Logout
          </li>
        </ul>
      </div>
      {!adminPrivilege ? (
        <div className="py-4">
          <span className="text-sm">Tasks</span>
          <ul className="py-3 space-y-2">
            <li
              onClick={() => setCurrentDisplay("viewTasks")}
              className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1"
            >
              <CgViewList className="inline" />
              View Tasks
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <div className="py-4">
            <span className="text-sm">Users</span>
            <ul className="py-3 space-y-2">
              <li
                onClick={() => setCurrentDisplay("viewUsers")}
                className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1"
              >
                <FaUsers className="inline" />
                View Users
              </li>
            </ul>
          </div>
          <div className="py-4">
            <span className="text-sm">Logs</span>
            <ul className="py-3 space-y-2">
              <li
                onClick={() => setCurrentDisplay("viewLogs")}
                className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1"
              >
                <CgViewList className="inline" />
                View Logs
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
