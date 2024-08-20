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
        localStorage.setItem("userEmail", data.email);
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
    <main className="flex justify-center items-center flex-col w-full h-[100vh]">
      <form
        action=""
        className="flex justify-center items-center flex-col w-full max-w-[400px] p-5 border border-gray-300 rounded-[10px] bg-white shadow-md"
      >
        <h1 className="mb-5 text-[2rem] text-gray-800">Login</h1>
        <div className="flex flex-col w-full mb-[15px]">
          <label
            htmlFor="email"
            className="self-start mb-[5px] text-[1rem] text-gray-800"
          >
            Email or Username
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="w-full p-[10px] border border-gray-300 rounded-[5px] text-[1rem]"
            required
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col w-full mb-[15px]">
          <label
            htmlFor="password"
            className="self-start mb-[5px] text-[1rem] text-gray-800"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-[10px] border border-gray-300 rounded-[5px] text-[1rem]"
            required
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full p-[10px] mt-[10px] border-none rounded-[5px] bg-[#2a7f22] text-white text-[1rem] cursor-pointer hover:bg-[#144c10]"
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 mt-[10px]">{error}</p>}
        {success && <p className="text-green-500 mt-[10px]">{success}</p>}
        <p className="mt-[15px] text-[1rem] text-gray-800">
          New Player?{" "}
          <a
            href="/signup"
            className="text-[#007bff] no-underline hover:underline"
          >
            Sign Up
          </a>
        </p>
      </form>
    </main>
  );
};

export default UserLogin;
