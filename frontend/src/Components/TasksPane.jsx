import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../pages/contexts/AuthContext.jsx";
import TaskCard from "./TaskCard";
import { useTasks } from "../hooks/useApi";
import SearchBar from "./SearchBar.jsx";
import Pagination from "./Pagination.jsx";

const TasksPane = ({ isAdmin, displayUser }) => {
  // Contexts
  const { user, initialized } = useContext(AuthContext);

  //  States
  const [sortParams, setSortParams] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // For Searchbar (Lifting State)
  const [query, setQuery] = useState("");

  //  Variables
  const tasksPerPage = 3;

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks(
    !isAdmin
      ? user && initialized
        ? { user_mail: null, sortParams }
        : null
      : { user_mail: displayUser.email, sortParams }
  );

  const filtered = tasks
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Fetching current Page Tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currTasks =
    !tasksLoading && tasks
      ? filtered.slice(indexOfFirstTask, indexOfLastTask)
      : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortParams]);

  // Functions
  const handleSort = (sort_by, sort_desc = false) => {
    setSortParams({ sort_by, sort_desc });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="basis-4/5 px-12 py-2">
      <SearchBar query={query} setQuery={setQuery} handleSort={handleSort} />
      <div className="tasks flex-4 py-4">
        {/* Tasks Display */}
        <div className="py-6">
          <div className="flex justify-between items-center pb-2">
            <h1 className="font-bold text-3xl">
              Tasks {isAdmin ? "for " + displayUser.full_name : ": "}
            </h1>
          </div>

          {tasksLoading && <div>Loading tasks…</div>}
          {tasksError && <div className="text-red-600">{tasksError}</div>}
          {!tasksLoading && !tasksError && filtered.length === 0 && (
            <div>No tasks to show.</div>
          )}
          {!tasksLoading && !tasksError && filtered.length > 0 && (
            <>
              <ul className="space-x-6 flex gap-10 justify-baseline py-6">
                {currTasks.map((t) => (
                  <li key={t.id}>
                    <TaskCard
                      task={t}
                      params={sortParams}
                      displayUser={displayUser}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <Pagination
                  itemsPerPage={tasksPerPage}
                  totalItems={filtered.length}
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
