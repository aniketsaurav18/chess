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
        body: JSON.stringify({
          email: email,
          password: password,
          userName: username,
        }),
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (response.ok) {
        setSuccess(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", data.email);
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
        <h1 className="mb-5 text-[2rem] text-gray-800">Sign Up</h1>
        <div className="flex flex-col w-full mb-[15px]">
          <label
            htmlFor="username"
            className="self-start mb-[5px] text-[1rem] text-gray-800"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full p-[10px] border border-gray-300 rounded-[5px] text-[1rem]"
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
            required
          />
        </div>
        <div className="flex flex-col w-full mb-[15px]">
          <label
            htmlFor="email"
            className="self-start mb-[5px] text-[1rem] text-gray-800"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-[10px] border border-gray-300 rounded-[5px] text-[1rem]"
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
            required
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
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
            required
          />
        </div>
        <div className="flex flex-col w-full mb-[15px]">
          <label
            htmlFor="confirm-password"
            className="self-start mb-[5px] text-[1rem] text-gray-800"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            className="w-full p-[10px] border border-gray-300 rounded-[5px] text-[1rem]"
            onChange={(e) => {
              setConfirmPassword(e.currentTarget.value);
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-[10px] mt-[10px] border-none rounded-[5px] bg-[#3db338] text-white text-[1rem] cursor-pointer hover:bg-[#2d8e38]"
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? "Signing in..." : "Sign up"}
        </button>
        {error && <p className="text-red-500 mt-[10px]">{error}</p>}
        {success && <p className="text-green-500 mt-[10px]">{success}</p>}
        <p className="mt-[15px] text-[1rem] text-gray-800">
          Already have an account?{" "}
          <a
            className="text-[#007bff] no-underline hover:underline"
            href="/login"
          >
            Login
          </a>
        </p>
      </form>
    </main>
  );
};

export default UserSignup;
