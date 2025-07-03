import React from "react";
import {
  FaGithub,
  FaUserShield,
  FaUsers,
  FaClipboardList,
  FaDocker,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function About() {
  const features = [
    {
      icon: <FaUserShield size={24} />,
      title: "Authentication & Roles",
      desc: "Secure JWT-based signup/login with Admin and Regular user roles.",
    },
    {
      icon: <FaClipboardList size={24} />,
      title: "Task CRUD",
      desc: "Create, read, update, delete tasks with status, priority, and due dates.",
    },
    {
      icon: <FaChartLine size={24} />,
      title: "Filtering & Sorting",
      desc: "View and sort tasks by status, priority, or due date.",
    },
    {
      icon: <FaUsers size={24} />,
      title: "Task Assignment",
      desc: "Admins assign tasks to users and view grouped lists.",
    },
    {
      icon: <FaClipboardList size={24} />,
      title: "Audit Logs",
      desc: "Track creations, updates, deletions in an admin-accessible log.",
    },
    {
      icon: <FaRobot size={24} />,
      title: "AI Suggestions",
      desc: "Get task ideas via OpenAI and save them with one click.",
    },
    {
      icon: <FaDocker size={24} />,
      title: "Dockerized",
      desc: "Seamless setup with Docker Compose for frontend, backend, and DB.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold mb-10 text-center">
            About TaskManager
          </h1>
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-full text-sm font-medium transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
        <p className="text-lg mb-12 text-center">
          TaskMaster is a full-featured task management platform built with:
          <br />
          React, FastApi, Postgresql, and Docker.
          <div className="text-lg text-center mt-2">
            Organize, assign, and get AI-powered suggestions for your tasks.
          </div>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4 text-purple-400">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>

              <p className="text-gray-300 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="mb-2">Made by Vasu Bhardwaj.</p>
          <a
            href="https://github.com/vasubhrdwj"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-100"
          >
            <FaGithub size={20} color={"white"} />
            <span>github.com/vasubhrdwj</span>
          </a>
        </div>
      </div>
    </div>
  );
}
