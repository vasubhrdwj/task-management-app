import { createContext, useState } from "react";

const UserContext = createContext({
  /*Values our context will have */
});

export function UserContextProvider() {
//   {
//     /* takes in what (the jsx which we will wrap around(<App />)*/
//   }
  const [accessToken, setAccessToken] = useState(null);


  return <UserContext.Provider value={/* What we will provide to our child compontent*/}>
    {/* children */}
  </UserContext.Provider>
}
