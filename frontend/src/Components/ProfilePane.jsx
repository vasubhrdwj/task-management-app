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
    <div className="flex items-center justify-center min-h-150 bg-gray-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          {/* User Icon */}
          <div className="bg-gray-400 rounded-full p-4 mb-4">
            <FiUser size={48} className="text-gray-100" />
          </div>

          {/* User Info */}
          <h3 className="text-xl font-semibold my-2 text-gray-800">
            {user.full_name}
          </h3>
          <p className="text-gray-500 mb-6">{user.email}</p>

          <div className="w-full divide-y divide-gray-200 px-4">
            <div className="py-4 flex justify-between text-gray-600">
              <span className="font-medium">Role:</span>
              <span>{user.is_admin ? "Admin" : "User"}</span>
            </div>
            <div className="py-4 flex justify-between text-gray-600">
              <span className="font-medium">Gender:</span>
              <span>{user.gender || "Not specified"}</span>
            </div>
            <div className="py-4 flex justify-between text-gray-600">
              <span className="font-medium">DOB:</span>
              <span>{parseDate(user.dob)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPaneCard;
