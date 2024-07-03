import { useState, useEffect } from "react";

interface User {
  userId: string;
  email: string;
  token: string;
  type: "guest" | "user";
}

const useUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (userId && email && token) {
      setUser({ userId, email, token, type: "user" });
    } else {
      setUser({ userId: "", email: "", token: "", type: "guest" });
    }
  }, []);

  return user;
};

export default useUser;
