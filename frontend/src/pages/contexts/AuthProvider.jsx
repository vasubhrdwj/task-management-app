import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../api";

export default function AuthContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setInitialized(true);
      return;
    }

    setInitialized(false);
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
      })
      .finally(() => {
        setInitialized(true);
      });
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser, initialized }}
    >
      {children}
    </AuthContext.Provider>
  );
}
