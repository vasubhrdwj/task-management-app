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
    <div className="w-full md:w-70 h-full bg-black rounded-2xl p-4 text-gray-300">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 pt-4 pb-8 border-b border-gray-700 justify-center">
        <FaTasks size={20} className="text-blue-400" />
        <span className="text-xl font-bold text-white">TaskManager</span>
      </div>

      {/* Profile Section */}
      <div className="py-6 px-2">
        <span className="text-sm tracking-wide text-gray-400">
          {adminPrivilege ? "Admin Profile" : "Profile"}
        </span>
        <ul className="mt-3 space-y-1">
          <li
            onClick={() => setCurrentDisplay("profile")}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
          >
            <CgProfile className="text-gray-400" />
            <span className="text-gray-200">View Profile</span>
          </li>
          <li
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
          >
            <CgLogOut className="text-gray-400" />
            <span className="text-gray-200">Logout</span>
          </li>
        </ul>
      </div>

      {/* Tasks or Admin Sections */}
      {!adminPrivilege ? (
        <div className="py-4 px-2">
          <span className="text-sm  tracking-wide text-gray-400">Tasks</span>
          <ul className="mt-3 space-y-1">
            <li
              onClick={() => setCurrentDisplay("viewTasks")}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
            >
              <CgViewList className="text-gray-400" />
              <span className="text-gray-200">View Tasks</span>
            </li>
          </ul>
        </div>
      ) : (
        <>
          <div className="py-4 px-2">
            <span className="text-sm  tracking-wide text-gray-400">Users</span>
            <ul className="mt-3 space-y-1">
              <li
                onClick={() => setCurrentDisplay("viewUsers")}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
              >
                <FaUsers className="text-gray-400" />
                <span className="text-gray-200">View Users</span>
              </li>
            </ul>
          </div>
          <div className="py-4 px-2">
            <span className="text-sm  tracking-wide text-gray-400">Logs</span>
            <ul className="mt-3 space-y-1">
              <li
                onClick={() => setCurrentDisplay("viewLogs")}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
              >
                <CgViewList className="text-gray-400" />
                <span className="text-gray-200">View Logs</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
