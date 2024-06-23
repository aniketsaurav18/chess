import "./UserSignup.css";
import { useState } from "react";

const UserSignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password, userName: username }),
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (response.ok) {
        setSuccess(data.message);
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", data.email);
        window.location.href = "/game"
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
      <form action="" className="signup-form">
        <h1>Sign Up</h1>
        <div className="signup-element">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
            required
          />
        </div>
        <div className="signup-element">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
            required
          />
        </div>
        <div className="signup-element">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
            required
          />
        </div>
        <div className="signup-element">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            onChange={(e) => {
              setConfirmPassword(e.currentTarget.value);
            }}
            required
          />
        </div>
        <button type="submit" disabled={loading} onClick={onSubmit}>
          {loading ? "Signing in..." : "Sign up"}
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
};

export default UserSignup;
