import { createContext, useState } from "react";

const UserContext = createContext({
  accessToken: null,
  setAccessToken: () => {},
});

export function UserContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  return (
    <UserContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
}
