import { useContext, useState } from "react";
import { AuthContext } from "../pages/contexts/AuthContext.jsx";
import TaskCard from "./TaskCard";
import { useTasks } from "../hooks/useApi";
import SearchBar from "./SearchBar.jsx";
import Pagination from "./Pagination.jsx";

const TasksPane = () => {
  // Contexts
  const { user, initialized } = useContext(AuthContext);

  //  States
  const [sortParams, setSortParams] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  //  Variables
  const tasksPerPage = 3;

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks(user && initialized ? sortParams : null);

  // Fetching current Page Tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currTasks =
    !tasksLoading && tasks
      ? tasks.slice(indexOfFirstTask, indexOfLastTask)
      : [];

  // Functions
  const handleSort = (sort_by, sort_desc = false) => {
    setSortParams({ sort_by, sort_desc });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="basis-4/5 px-12 py-2">
      <SearchBar handleSort={handleSort} />
      <div className="tasks flex-4 py-4">
        {/* Tasks Display */}
        <div className="py-6">
          <div className="flex justify-between items-center pb-2">
            <h1 className="font-bold text-3xl">Tasks:</h1>
          </div>

          {/* {isAdding && (
              <TaskForm
                initialValues={{
                  title: "",
                  description: "",
                  deadline: new Date().toISOString().slice(0, 10),
                  priority: "medium",
                }}
                onSubmit={(values) => {
                  createTask({ updates: values, user_mail: user.email });
                  setIsAdding(false);
                }}
                onCancel={() => setIsAdding(false)}
                isLoading={creating}
                heading="Add New Task"
                submitLabel="Create Task"
              />
            )} */}

          {tasksLoading && <div>Loading tasks…</div>}
          {tasksError && <div className="text-red-600">{tasksError}</div>}
          {!tasksLoading && !tasksError && tasks.length === 0 && (
            <div>No tasks to show.</div>
          )}
          {!tasksLoading && !tasksError && tasks.length > 0 && (
            <>
              <ul className="space-y-6 flex gap-10 justify-baseline py-6">
                {currTasks.map((t) => (
                  <li key={t.id}>
                    <TaskCard task={t} params={sortParams} />
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <Pagination
                  tasksPerPage={tasksPerPage}
                  totalTasks={tasks.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPane;
