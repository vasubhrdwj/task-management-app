import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/create", {
        email: email,
        full_name: name,
        is_admin: isAdmin,
        password: password,
      });
      console.log("Success!", response.data);

    } catch (err) {
      setError(err.response?.data?.detail || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => setShow((s) => !s);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-10 text-center">Sign Up</h2>
        {error && <p className="text-red-600 mb-2 text-base">{error}</p>}

        <label className="block mb-8">
          <span className="text-base font-medium">Name: </span>
          <input
            type="text"
            value={name}
            placeholder="Jack Sparrow"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded border p-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        <label className="block mb-8">
          <span className="text-base font-medium">Email Address : </span>
          <input
            type="email"
            value={email}
            placeholder="your@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border p-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>
        <label className="inline-flex items-center space-x-2 mb-8">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-400 rounded"
          />
          <span className="text-base font-medium">Admin account?</span>
        </label>
        <label className="block mb-12">
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
          {loading ? "Signing up…" : "Signup"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
