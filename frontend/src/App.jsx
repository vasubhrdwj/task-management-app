import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={Login}></Route>
      </Routes>
    </div>
  );
};

export default App;
