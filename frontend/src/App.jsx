import React, { useState } from "react";
import api from "./api";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("password");

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

  const handleToggle = async () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-12 text-center">Login</h2>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <label className="block mb-8 text-base font-medium">
          <span>Email Address :</span>
          <input
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block mb-8 text-base font-medium">
          <span>Password:</span>
          <div className="flex items-center mt-1 border rounded px-2">
            <input
              type={type}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-2 focus:outline-none"
            />
            <span
              onClick={handleToggle}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
            >
              👁️{" "}
              {/* Replace with an icon from lucide-react, heroicons, or fontawesome */}
            </span>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50 mb-12 mt-6"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default App;
