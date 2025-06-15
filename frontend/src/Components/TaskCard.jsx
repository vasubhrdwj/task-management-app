import { React, useState } from "react";
import { MdEditNote, MdDeleteOutline, MdTaskAlt } from "react-icons/md";
import useUpdateTask from "../hooks/useUpdateTask";

const TaskCard = ({ task, params }) => {
  const dsc = task.description;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    deadline: task.deadline,
  });

  const { mutate: updateTask, isLoading } = useUpdateTask({ params });

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
  return (
    <div className="w-78 h-[420px] border-1 py-4 rounded-2xl bg-white shadow-lg shadow-gray-400">
      {/* Title */}
      <div className="h-1/7 text-xl font-semibold pl-4 p-2 capitalize">
        {task.title}
      </div>
      {/* Priority Bar */}
      <div className="h-1/7 bg-stone-200 p-2 text-lg flex justify-between items-center">
        <button
          className="border-1 text-xs px-2 py-2 w-4/10 rounded-md bg-white m-1 flex items-center justify-center hover:bg-teal-500"
          onClick={() => toggleComplete()}
        >
          &#10003; Mark Complete
        </button>

        <div className="flex items-center gap-1">
          <button
            className="pt-0.5"
            onClick={() => {
              openEditor();
            }}
          >
            <MdEditNote size={28} />
          </button>
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

      {/* Modal Content */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            {/* Title */}
            <label className="block mb-2">
              <span className="font-semibold">Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </label>

            {/* Description */}
            <label className="block mb-2">
              <span className="font-semibold">Description</span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </label>

            {/* Deadline */}
            <label className="block mb-2">
              <span className="font-semibold">Deadline</span>
              <input
                type="date"
                value={form.deadline.slice(0, 10)} // “YYYY‑MM‑DD”
                onChange={(e) =>
                  setForm((f) => ({ ...f, deadline: e.target.value }))
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </label>

            {/* Priority */}
            <label className="block mb-4">
              <span className="font-semibold">Priority</span>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value }))
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  updateTask({
                    taskId: task.id,
                    updates: {
                      title: form.title,
                      description: form.description,
                      deadline: form.deadline,
                      priority: form.priority,
                    },
                  });
                  setIsEditing(false);
                }}
                disabled={isLoading}
              >
                {isLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
