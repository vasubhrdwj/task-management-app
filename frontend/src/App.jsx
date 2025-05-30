import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import Home from "./pages/Home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </div>
  );
};

export default App;
