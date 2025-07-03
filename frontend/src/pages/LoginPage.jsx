import React, { useContext, useState, useEffect } from "react";
import api from "../api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const { accessToken, setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) navigate("/dashboard", { replace: true });
  }, [accessToken, navigate]);

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

      const { access_token } = response.data;
      setAccessToken(access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-10 text-center text-white">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-base">{error}</p>}

        {/* Email */}
        <label className="block mb-8">
          <span className="text-base font-medium text-gray-200">
            Email Address
          </span>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full rounded bg-gray-700 text-white border border-gray-600 p-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        {/* Password */}
        <label className="block mb-12">
          <span className="text-base font-medium text-gray-200">Password</span>
          <div className="flex items-center bg-gray-700 border border-gray-600 rounded px-2 mt-2">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-gray-700 text-white p-2 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={handleToggle}
              className="p-2 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
