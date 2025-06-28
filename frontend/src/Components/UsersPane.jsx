import { useState } from "react";
import { useUsers } from "../hooks/useApi";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Button,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

import useCreateTask from "../hooks/useCreateTask";
import TaskForm from "./TaskForm";
import SuggestTaskPane from "./SuggestTaskPane";

export default function UsersPane({ setCurrentDisplay, setDisplayTaskUser }) {
  const {
    data: usersList,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const { mutate: createTask, isLoading: creating } = useCreateTask();

  if (usersError)
    return (
      <div className="text-md text-red-600 font-semibold">
        Error in Fetching Users: {usersError}
      </div>
    );

  if (usersLoading) {
    return <div className="text-lg">Loading Users...</div>;
  }

  return (
    <div className="h-full w-full rounded-xl text-white flex flex-col justify-around">
      <div className="bg-gray-950 flex items-center justify-between h-5/10 rounded-xl">
        <div className="bg-white/10 h-full w-34 px-6 py-8 leading-relaxed overflow-clip text-xl font-bold">
          Assign Tasks
        </div>
        <div className="relative w-72 my-6 mr-20 self-baseline">
          <Listbox value={selectedUsers} onChange={setSelectedUsers} multiple>
            <ListboxButton
              className={clsx(
                "relative block w-full rounded-lg bg-white/5 py-2.5 pr-8 pl-3 text-left text-sm text-white",
                "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              )}
            >
              {selectedUsers.length
                ? `Selected (${selectedUsers.length})`
                : "Pick users…"}
              <ChevronDownIcon
                className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-white/60"
                aria-hidden="true"
              />
            </ListboxButton>
            {/* 2) absolute dropdown */}
            <ListboxOptions
              className={clsx(
                "absolute z-10 mt-1 left-0 w-full max-h-60 overflow-auto",
                "rounded-xl border border-white/5 bg-white/5 p-1",
                "focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0"
              )}
            >
              {usersList.map((user) => (
                <ListboxOption
                  key={user.id}
                  value={user}
                  className={({ focus, selected }) =>
                    clsx(
                      "group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5",
                      focus && "bg-white/10",
                      selected && "font-semibold"
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <CheckIcon
                        className={clsx(
                          "h-5 w-5",
                          selected ? "visible text-white" : "invisible"
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-300">{user.email}</p>
                      </div>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
        <div className="mx-20 flex flex-col items-center justify-around self-stretch py-8">
          <div>
            <Button
              onClick={() => setIsAdding(true)}
              disabled={selectedUsers.length === 0}
              className="inline-flex items-center overflow-clip w-42 leading-relaxed gap-2 rounded-md bg-gray-700 p-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
            >
              Add Task for Selected Users
            </Button>
            {isAdding && (
              <TaskForm
                initialValues={{
                  title: "",
                  description: "",
                  deadline: new Date().toISOString().slice(0, 10),
                  priority: "medium",
                }}
                onSubmit={(values) => {
                  createTask({
                    updates: values,
                    user_mail_list: selectedUsers.map((user) => user.email),
                  });
                  setIsAdding(false);
                }}
                onCancel={() => setIsAdding(false)}
                isLoading={creating}
                heading="Add New Task"
                submitLabel="Create Task"
              />
            )}
          </div>
          <SuggestTaskPane selectedUsers={selectedUsers} />
        </div>
      </div>
      <div className="bg-[linear-gradient(_85.2deg,_rgba(33,3,40,1)_17.5%,_rgba(65,5,72,1)_88.7%_)]   flex items-center justify-between h-48/100 rounded-xl">
        <div className="bg-white/10 h-full w-34 px-6 py-8 leading-relaxed overflow-clip text-xl font-bold">
          See User's Tasks
        </div>
        <div className="relative w-72 my-6 mr-20 self-baseline">
          <Listbox value={viewUser} onChange={setViewUser}>
            <ListboxButton
              className={clsx(
                "relative block w-full rounded-lg bg-white/5 py-2.5 pr-8 pl-3 text-left text-sm text-white",
                "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              )}
            >
              {viewUser ? `Selected: ${viewUser.full_name}` : "Pick users…"}
              <ChevronDownIcon
                className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-white/60"
                aria-hidden="true"
              />
            </ListboxButton>
            {/* 2) absolute dropdown */}
            <ListboxOptions
              className={clsx(
                "absolute z-10 mt-1 left-0 w-full max-h-60 overflow-auto",
                "rounded-xl border border-white/5 bg-white/5 p-1",
                "focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0"
              )}
            >
              {usersList.map((user) => (
                <ListboxOption
                  key={user.id}
                  value={user}
                  className={({ focus, selected }) =>
                    clsx(
                      "group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5",
                      focus && "bg-white/10",
                      selected && "font-semibold"
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <CheckIcon
                        className={clsx(
                          "h-5 w-5",
                          selected ? "visible text-white" : "invisible"
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-300">{user.email}</p>
                      </div>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
        <div className="mx-20">
          <Button
            onClick={() => {
              setCurrentDisplay("viewTasks");
              setDisplayTaskUser(viewUser);
            }}
            className="inline-flex items-center overflow-clip w-42 leading-relaxed gap-2 rounded-md bg-gray-700 p-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
          >
            View User Task Details
          </Button>
        </div>
      </div>
    </div>
  );
}
