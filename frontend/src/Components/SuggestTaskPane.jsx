import React, { useState } from "react";
import { useSuggestTask } from "../hooks/useSuggestTask";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";

import useCreateTask from "../hooks/useCreateTask";

const SuggestTaskPane = ({ selectedUsers = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: suggestion, isFetching, isError, refetch } = useSuggestTask();

  const { mutate: createTask } = useCreateTask();

  const handleClick = async () => {
    await refetch();
    setIsOpen(true);
  };

  const handleSubmit = (suggestion) => {
    createTask({
      updates: suggestion,
      user_mail_list: selectedUsers.map((user) => user.email),
    });
    setIsOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => handleClick()}
        disabled={isFetching}
        className="inline-flex items-center justify-center overflow-clip w-42 leading-relaxed gap-2 rounded-md bg-gray-700 p-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
      >
        {isFetching ? "Loading…" : "Suggest Task"}
      </Button>

      {isError && (
        <p className="text-red-600">Error fetching suggestion. Try again.</p>
      )}

      {suggestion && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-10 focus:outline-none"
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="w-full max-w-xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <DialogTitle
                  as="h3"
                  className="text-base/7 font-medium text-white"
                >
                  Add Generated Task ?
                </DialogTitle>
                <div className="mt-2 text-sm/6 text-white/50 space-y-2">
                  <p>
                    <strong>Title:</strong> {suggestion.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {suggestion.description}
                  </p>
                  <p>
                    <strong>Due:</strong> {suggestion.deadline}
                  </p>
                  <p>
                    <strong> Priority:</strong> {suggestion.priority}
                  </p>
                </div>
                <div className="justify-end flex gap-2 mt-4">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center overflow-clip w-24 leading-relaxed gap-2 rounded-md bg-gray-700 p-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSubmit(suggestion)}
                    className="inline-flex items-center justify-center overflow-clip w-24 leading-relaxed gap-2 rounded-md bg-gray-700 p-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                  >
                    Add Task
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default SuggestTaskPane;
