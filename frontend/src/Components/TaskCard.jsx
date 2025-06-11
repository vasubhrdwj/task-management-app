import React from "react";

const TaskCard = () => {
  return (
    <div className="w-1/5 border-1 pt-2 pb-4 rounded-2xl bg-white shadow-lg">
      {/* Title */}
      <div className="h-2/7 text-xl font-semibold pl-4 p-2">Task 1</div>
      {/* Priority Bar */}
      <div className="h-1/7 bg-indigo-100 p-2 text-lg flex justify-between">
        <div className="border-1 p-1 pl-2 pr-2 w-4/10 rounded-md bg-white m-1">
          <p className="text-xs">&#10003; Mark Complete</p>
        </div>
        <p className="pr-2 text-lg">...</p>
      </div>
      <div className="h-4/7 p-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, distinctio
        adipisci. Harum pariatur, labore illum ad, vel id velit amet nesciunt
        corrupti nisi unde, voluptatem qui autem neque voluptatibus molestias.
      </div>
    </div>
  );
};

export default TaskCard;
