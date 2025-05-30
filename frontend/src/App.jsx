import React, { useState } from "react";
import api from "./api";

const App = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/login",
        new URLSearchParams({
          username: "vasu@gmail.com",
          password: "vasu123",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <label htmlFor="email" className="form-label">
          Email Address:
        </label>
        <input type="email" className="form-control" id="email" />
      </div>
      <div>
        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <input type="password" className="form-control" id="password" />
      </div>
      <div className="login-btn">
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default App;
