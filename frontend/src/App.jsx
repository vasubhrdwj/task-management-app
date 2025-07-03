import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import Home from "./pages/Home";
import Signup from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </div>
  );
};

export default App;
