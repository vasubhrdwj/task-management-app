import React, { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col">
      {/* Navbar */}
      <div className="py-8 px-20">
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="relative flex-1 h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24"
            style={{
              background:
                "radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-start pt-24 px-4">
          <div className="max-w-3xl text-center">
            <h1 className="mb-12 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-violet-600">Task</span> Manager
            </h1>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-slate-300">
              Organize your day-to-day tasks in one place. Add deadlines, set
              priorities, and track progress—all with a clean, intuitive
              interface. <br />
              Suitable for both personal and professional use, our task manager
              helps you stay on top of your responsibilities and achieve your
              goals efficiently.
            </p>
            <div className="pt-6 flex flex-wrap justify-center gap-8">
              <Link
                to="/signup"
                className="rounded-lg px-6 py-3 font-medium bg-purple-500 text-slate-900 hover:bg-purple-300"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="rounded-lg border px-6 py-3 font-medium border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav
      className="
        bg-white/10            
        backdrop-blur-md
        border border-white/20 
        shadow-lg
        px-8 py-6
        rounded-xl
      "
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">Task Manager</div>

        {/* Nav links */}
        <div className="flex items-center space-x-6 text-md font-semibold">
          <Link
            to="/about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            to="/login"
            className="
              px-4 py-2
              border border-purple-600
              text-purple-600
              rounded-md
              hover:bg-purple-500 hover:text-white
              transition
            "
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="
              px-4 py-2
              bg-purple-700
              text-white
              rounded-md
              hover:bg-purple-900
              transition
            "
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Home;
