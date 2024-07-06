import { useState, useEffect } from "react";

interface User {
  userId: string;
  email: string;
  token: string;
  type: "guest" | "user";
}

const useUser = (): User => {
  const [user, setUser] = useState<User>({
    userId: "",
    email: "",
    token: "",
    type: "guest",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (userId && email && token) {
      setUser(() => {
        return { userId: userId, email: email, token: token, type: "user" };
      });
    }
  }, []);

  return user;
};

export default useUser;
