import React, { useState } from "react";
import api from "../api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow((s) => !s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const response = await api.post(
        "/login",
        new URLSearchParams({ username: email, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      console.log("Success!", response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-10 text-center">Login</h2>
        {error && <p className="text-red-600 mb-2 text-base">{error}</p>}

        <label className="block mb-10">
          <span className="text-base font-medium">Email Address</span>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border p-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        <label className="block mb-18">
          <span className="text-base font-medium">Password</span>
          <div className="flex items-center border rounded px-2 mt-1">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-2 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={handleToggle}
              className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
