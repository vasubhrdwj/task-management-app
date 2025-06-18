import { useState } from "react";
import { useUsers } from "../hooks/useApi";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function UsersPane() {
  const {
    data: usersList,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  const [selectedUsers, setSelectedUsers] = useState([]);

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
    <div className="h-full w-full bg-slate-900 rounded-xl text-white flex flex-col items-center justify-center">
      {/* 1) relative wrapper, fix width to match button */}
      <div className="relative w-96 py-8">
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
      <div>
        {selectedUsers.length > 0 &&
          selectedUsers.map((user) => <div>{user.email}</div>)}
      </div>
    </div>
  );
}
