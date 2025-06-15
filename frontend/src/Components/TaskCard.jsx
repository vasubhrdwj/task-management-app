import React from "react";
import { MdEditNote, MdDeleteOutline, MdTaskAlt } from "react-icons/md";
import useUpdateTask from "../hooks/useUpdateTask";

const TaskCard = ({ task }) => {
  const dsc = task.description;

  const mutation = useUpdateTask();

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
    }
  };

  const parseDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const toggleComplete = () => {
    const status = !task.is_complete;
    mutation.mutate({ taskId: task.id, updates: { is_complete: status } });
  };
  return (
    <div className="w-78 h-[420px] border-1 py-4 rounded-2xl bg-white shadow-lg shadow-gray-400">
      {/* Title */}
      <div className="h-1/7 text-xl font-semibold pl-4 p-2 capitalize">
        {task.title}
      </div>
      {/* Priority Bar */}
      <div className="h-1/7 bg-stone-200 p-2 text-lg flex justify-between items-center">
        <div className="border-1 px-2 py-2 w-4/10 rounded-md bg-white m-1 flex items-center justify-center hover:bg-teal-500">
          <button className="text-xs " onClick={() => toggleComplete()}>
            &#10003; Mark Complete
          </button>
        </div>
        <div className="flex items-center gap-1">
          <p className="pt-0.5">
            <MdEditNote size={28} />
          </p>
          <p>
            <MdDeleteOutline size={24} color={"red"} />
          </p>
        </div>
      </div>
      <div className="h-4/7 p-4 flex flex-col gap-6">
        <div className="border-b border-gray-400">
          <span className="font-semibold text-md">Description:</span>
          <div className="py-4 pl-6">{dsc}</div>
        </div>

        <div className="capitalize">
          <span className="font-semibold text-md mr-1">Priority : </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-xl ${getPriorityClasses(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>
        <div className="capitalize">
          <span className="font-semibold text-md mr-2">Status:</span>
          <span
            className={`px-2 py-0.5 border rounded-full text-sm font-semibold text-center
      ${
        task.is_complete
          ? "border-green-400 text-green-800"
          : "border-gray-400 text-gray-800"
      }
    `}
          >
            {task.is_complete ? "Completed" : "Ongoing"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-md">Deadline: </span>
          {parseDate(task.deadline)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
