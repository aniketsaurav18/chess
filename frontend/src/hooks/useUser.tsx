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
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("user", user);
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (user && token) {
      setUser(() => {
        return {
          userId: user.userId,
          name: user.name,
          email: user.email,
          token: token,
          username: user.username,
          avatarUrl: user.avatarUrl ?? undefined,
          type: "user",
        };
      });
    }
  }, []);

  return user;
};

export default useUser;
