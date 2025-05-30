import React, { useState } from "react";
import api from "./api";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      console.log(email);
      const response = await api.post(
        "/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Success! ", response.data);
    } catch (error) {
      setError(error.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
        {error && <p className="error-log">{error}</p>}

        <label className="block mb-4">
          <span>Email Address :</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="form-label">
          <span>Password: </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default App;
