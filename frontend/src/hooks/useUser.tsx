import { useState, useEffect } from "react";

export interface User {
  userId: string;
  email: string;
  token: string;
  name: string;
  username: string;
  type: "guest" | "user";
  avatarUrl?: string;
}

const useUser = (): User => {
  const [user, setUser] = useState<User>({
    userId: "",
    email: "",
    name: "Guest",
    token: "",
    username: "guest",
    type: "guest",
    avatarUrl: undefined,
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const name = localStorage.getItem("name");
    const avatarUrl = localStorage.getItem("avatarUrl");

    if (userId && email && token && username && name) {
      setUser(() => {
        return {
          userId: userId,
          name: name,
          email: email,
          token: token,
          username: username,
          avatarUrl: avatarUrl ?? undefined,
          type: "user",
        };
      });
    }
  }, []);

  return user;
};

export default useUser;
