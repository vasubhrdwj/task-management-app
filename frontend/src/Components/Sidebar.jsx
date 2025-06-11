import React from "react";
import { FaTasks } from "react-icons/fa";
import { CgProfile, CgLogOut, CgViewList } from "react-icons/cg";
const Sidebar = () => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-2xl p-4 text-slate-500">
      <div className="flex items-center gap-2 text-white px-1 pt-4 pb-10 border-b border-white/30 justify-center">
        <FaTasks size={23} className="text-white " />
        <span className="text-2xl font-bold ">TaskManager</span>
      </div>
      <div className="py-6">
        <span className="text-sm">Profile</span>
        <ul className="py-3 space-y-2">
          <li className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1">
            <CgProfile className="inline" />
            View Profile
          </li>
          <li className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1">
            <CgLogOut className="inline" />
            Logout
          </li>
        </ul>
      </div>
      <div className="py-4">
        <span className="text-sm">Tasks</span>
        <ul className="py-3 space-y-2">
          <li className="text-md items-center flex gap-2 hover:bg-gray-700 rounded-md px-4 py-1">
            <CgViewList className="inline" />
            View Tasks
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
