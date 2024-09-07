import { useState, useEffect } from "react";

interface User {
  userId: string;
  email: string;
  token: string;
  name: string;
  username: string;
  type: "guest" | "user";
}

const useUser = (): User => {
  const [user, setUser] = useState<User>({
    userId: "",
    email: "",
    name: "",
    token: "",
    username: "",
    type: "guest",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const name = localStorage.getItem("name");

    if (userId && email && token && username && name) {
      setUser(() => {
        return {
          userId: userId,
          name: name,
          email: email,
          token: token,
          username: username,
          type: "user",
        };
      });
    }
  }, []);

  return user;
};

export default useUser;
