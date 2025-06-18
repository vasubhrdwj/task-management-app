import React from "react";

const UsersPane = ({ user }) => {
  return (
    <div>
      This is the users pane
      <div>{user.full_name}</div>
      <div>{user.email}</div>
      <div>{user.is_admin ? "Admin" : "Not Admin"}</div>
    </div>
  );
};

export default UsersPane;
