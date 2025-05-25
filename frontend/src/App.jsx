import React, { useEffect, useState } from "react";
import api from "./api";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get("/tasks/");
      setTasks(response.data);
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Tasks:</h1>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </div>
  );
};

export default App;
