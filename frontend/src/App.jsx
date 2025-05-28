import React from "react";

const App = () => {
  return (
    <div>
      <div>
        <label htmlFor="email" className="form-label">
          Email Address:
        </label>
        <input type="email" className="form-control" id="email" />
      </div>
      <div>
        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <input type="password" className="form-control" id="password" />
      </div>
    </div>
  );
};

export default App;
