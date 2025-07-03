import React from "react";
import { FiUser } from "react-icons/fi";

const UsersPaneCard = ({ user }) => {
  const parseDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-150 bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          {/* User Icon */}
          <div className="bg-gray-700 rounded-full p-4 mb-4">
            <FiUser size={48} className="text-gray-300" />
          </div>

          {/* User Info */}
          <h3 className="text-xl font-semibold my-2 text-white">
            {user.full_name}
          </h3>
          <p className="text-gray-400 mb-6">{user.email}</p>

          <div className="w-full divide-y divide-gray-700 px-4">
            <div className="py-4 flex justify-between">
              <span className="font-medium text-gray-300">Role:</span>
              <span className="text-gray-200">
                {user.is_admin ? "Admin" : "User"}
              </span>
            </div>
            <div className="py-4 flex justify-between">
              <span className="font-medium text-gray-300">Gender:</span>
              <span className="text-gray-200">
                {user.gender || "Not specified"}
              </span>
            </div>
            <div className="py-4 flex justify-between">
              <span className="font-medium text-gray-300">DOB:</span>
              <span className="text-gray-200">{parseDate(user.dob)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPaneCard;
