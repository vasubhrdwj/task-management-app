import React from "react";
import { MdEditNote, MdDeleteOutline } from "react-icons/md";

const TaskCard = () => {
  return (
    <div className="w-78 border-1 pt-4 pb-4 rounded-2xl bg-white shadow-lg shadow-gray-400">
      {/* Title */}
      <div className="h-2/7 text-xl font-semibold pl-4 p-2">Task 1</div>
      {/* Priority Bar */}
      <div className="h-1/7 bg-indigo-100 p-2 text-lg flex justify-between items-center">
        <div className="border-1 p-1 pl-2 pr-2 w-4/10 rounded-md bg-white m-1">
          <p className="text-xs text-center">&#10003; Mark Complete</p>
        </div>
        <div className="flex items-center gap-1">
          <p className="pt-0.5">
            <MdEditNote size={28} />
          </p>
          <p>
            <MdDeleteOutline size={24} />
          </p>
        </div>
      </div>
      <div className="h-4/7 p-4 flex flex-col gap-6">
        <div className="mb-4"> Description </div>

        <div> Priority </div>
        <div> Status </div>
        <div> Deadline</div>
      </div>
    </div>
  );
};

export default TaskCard;
