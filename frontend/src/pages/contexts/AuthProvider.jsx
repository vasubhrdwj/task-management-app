import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../api";

export default function AuthContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      api
        .get("/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
          setAccessToken(null);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
