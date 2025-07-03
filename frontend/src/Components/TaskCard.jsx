import React, { useState } from "react";
import { MdEditNote, MdDeleteOutline, MdTaskAlt } from "react-icons/md";
import useUpdateTask from "../hooks/useUpdateTask";
import useDeleteTask from "../hooks/useDeleteTask";
import TaskForm from "./TaskForm";

const TaskCard = ({ task, params, displayUser }) => {
  const dsc = task.description;

  const [isEditing, setIsEditing] = useState(false);
  const [_, setForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    deadline: task.deadline,
  });

  const { mutate: updateTask, isLoading } = useUpdateTask({
    user_mail: displayUser ? displayUser.email : null,
    sortParams: params,
  });
  const { mutate: deleteTask } = useDeleteTask({
    user_mail: displayUser ? displayUser.email : null,
    sortParams: params,
  });

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-200 text-red-600";
      case "medium":
        return "bg-yellow-200 text-yellow-600";
      case "low":
        return "bg-green-200 text-green-600";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const parseDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const toggleComplete = () => {
    const status = !task.is_complete;
    updateTask({ taskId: task.id, updates: { is_complete: status } });
  };

  const openEditor = () => {
    setForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
    });
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="w-78 h-[430px] py-4 rounded-3xl bg-gray-800 shadow-lg shadow-gray-700">
      {/* Title */}
      <div className="h-1/7 text-xl font-bold pl-4 p-2 capitalize truncate text-white">
        {task.title}
      </div>

      {/* Action Bar */}
      <div className="h-1/7 bg-gray-700 p-2 flex justify-between items-center">
        <button
          onClick={toggleComplete}
          className={`flex items-center justify-center gap-1 px-4 py-2 rounded-full font-medium text-sm transition-transform transform hover:scale-105 focus:scale-95 shadow-md ${
            task.is_complete
              ? "bg-teal-600 hover:bg-teal-500"
              : "bg-gray-600 hover:bg-gray-500"
          } cursor-pointer`}
        >
          <MdTaskAlt size={20} />
          {task.is_complete ? "Completed" : "Mark Complete"}
        </button>

        <div className="flex items-center gap-2 text-gray-200">
          <button
            onClick={openEditor}
            className="p-2 hover:text-white transition"
          >
            <MdEditNote size={24} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:text-red-400 transition"
          >
            <MdDeleteOutline size={24} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-4/7 p-4 flex flex-col gap-6 text-gray-200">
        <div className="border-b border-gray-600">
          <span className="font-semibold text-md">Description:</span>
          <div className="py-2 pl-6 h-20 overflow-y-auto text-gray-300">
            {dsc}
          </div>
        </div>

        <div className="capitalize flex items-center gap-2">
          <span className="font-semibold text-md">Priority:</span>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-xl ${getPriorityClasses(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>

        <div className="capitalize flex items-center gap-2">
          <span className="font-semibold text-md">Status:</span>
          <span
            className={`px-2 py-0.5 border rounded-full text-sm font-semibold text-center ${
              task.is_complete
                ? "border-green-400 text-green-400"
                : "border-gray-500 text-gray-400"
            }
            }`}
          >
            {task.is_complete ? "Completed" : "Ongoing"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-md">Deadline:</span>
          <span className="text-gray-200">{parseDate(task.deadline)}</span>
        </div>
      </div>

      {/* Modal Editor */}
      {isEditing && (
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
          }}
          onSubmit={(values) => {
            updateTask({ taskId: task.id, updates: values });
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          isLoading={isLoading}
          heading="Edit Task"
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
};

export default TaskCard;
