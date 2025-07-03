import React, { useContext, useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "./contexts/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [success, setSuccess] = useState(false);

  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) navigate("/dashboard", { replace: true });
  }, [accessToken, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/users/create", {
        email,
        full_name: name,
        is_admin: isAdmin,
        password,
        dob,
        gender,
      });
      console.log(response);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => setShow((s) => !s);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Link
        to="/"
        className="text-gray-400 hover:text-gray-200 text-lg transition fixed top-15 left-20"
      >
        ← Back to Home
      </Link>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-10 text-center text-white">
          Sign Up
        </h2>
        {error && <p className="text-red-500 mb-2 text-base">{error}</p>}
        {success && (
          <p className="text-green-500 mb-2 text-base">Created User</p>
        )}

        {/* Name */}
        <label className="block mb-8">
          <span className="text-base font-medium text-gray-200">Name:</span>
          <input
            type="text"
            value={name}
            placeholder="Jack Sparrow"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 p-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        {/* Email */}
        <label className="block mb-8">
          <span className="text-base font-medium text-gray-200">
            Email Address:
          </span>
          <input
            type="email"
            value={email}
            placeholder="your@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 p-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        {/* Date of Birth & Gender */}
        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          <label className="block w-full">
            <span className="text-base font-medium text-gray-200">
              Date of Birth:
            </span>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 block w-full max-w-sm rounded bg-gray-700 text-white border border-gray-600 p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="block w-full">
            <span className="text-base font-medium text-gray-200">Gender:</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full max-w-sm rounded bg-gray-700 text-white border border-gray-600 p-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="NA">Prefer not to say</option>
            </select>
          </label>
        </div>

        {/* Is Admin */}
        <label className="inline-flex items-center space-x-2 mb-8">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 rounded"
          />
          <span className="text-base font-medium text-gray-200">
            Admin account?
          </span>
        </label>

        {/* Password */}
        <label className="block mb-12">
          <span className="text-base font-medium text-gray-200">Password</span>
          <div className="flex items-center border border-gray-600 rounded bg-gray-700 px-2 mt-1">
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
          {loading ? "Signing up…" : "Signup"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
