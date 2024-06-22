import "./UserLogin.css";
import { useState } from "react";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (!username || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }
    // console.log(backendUrl);
    // setTimeout(() => {
    //   setLoading(false);
    //   if (username === "testuser" && password === "password") {
    //     setSuccess("Login successful!");
    //   } else {
    //     setError("Invalid username or password");
    //   }
    // }, 1000);
    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (response.status === 200) {
        setSuccess(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.href = "/game";
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (e: any) {
      setLoading(false);
      setError("An error occurred");
    }
  };

  return (
    <main className="userlogin">
      <form action="" className="login-form">
        <h1>Login</h1>
        <div className="login-element">
          <label htmlFor="email">Email or Username</label>
          <input
            type="text"
            id="email"
            name="email"
            required
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </div>
        <div className="login-element">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <button type="submit" disabled={loading} onClick={onSubmit}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <p>
          New Player? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </main>
  );
};

export default UserLogin;
