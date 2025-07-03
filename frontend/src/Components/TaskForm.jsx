import { useState } from "react";

const TaskForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  heading = "Edit Task",
  submitLabel = "Save Changes",
}) => {
  const [form, setForm] = useState(initialValues);
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-8 w-80 mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {heading}
        </h2>

        {/* Title */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-200">Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Description */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-200">Description</span>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="mt-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <div className="flex gap-4">
          {/* Deadline */}
          <label className="flex-1">
            <span className="font-semibold text-gray-200">Deadline</span>
            <input
              type="date"
              value={form.deadline.slice(0, 10)}
              onChange={(e) =>
                setForm((f) => ({ ...f, deadline: e.target.value }))
              }
              className="mt-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Priority */}
          <label className="flex-1">
            <span className="font-semibold text-gray-200">Priority</span>
            <select
              value={form.priority}
              onChange={(e) =>
                setForm((f) => ({ ...f, priority: e.target.value }))
              }
              className="mt-2 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition disabled:opacity-50"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
            onClick={() => onSubmit(form)}
            disabled={isLoading}
          >
            {isLoading ? `${submitLabel}…` : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;