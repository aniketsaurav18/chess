import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SocialSignIn } from "../components/auth/social-signin";

export function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    const newError = { ...error };
    newError.email = email.trim() ? "" : "Please enter valid Email or Username";
    newError.password = password.trim() ? "" : "Please enter your Password";
    setError(newError);
    if (newError.email !== "" || newError.password !== "") {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setLoginError(
          data.message ? data.message : "An error occured while loggin in."
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      window.location.href = "/game";
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setLoginError("Some error occured");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <Card className="w-full max-w-md bg-[#1a1a1a] border border-[#2e2e2e]">
        <CardHeader className="flex flex-col items-center pb-0 pt-6">
          <h2 className="text-3xl font-bold text-white">Login</h2>
          <p className="mt-2 text-sm text-gray-400">
            Don't have an account?
            <Link
              className="ml-1 text-green-400 hover:text-green-300"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Link>
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            type="email"
            label="Email"
            variant="bordered"
            // placeholder="Enter your email"
            classNames={{
              label: "text-gray-400",
              input: "text-white",
              inputWrapper: "bg-[#2e2e2e] border-[#3b3b3b] hover:bg-[#3b3b3b]",
            }}
            onValueChange={setEmail}
          />
          <Input
            label="Password"
            variant="bordered"
            // placeholder="Enter your password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeIcon className="text-2xl text-gray-400" />
                ) : (
                  <EyeOffIcon className="text-2xl text-gray-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            classNames={{
              label: "text-gray-400",
              input: "text-white",
              inputWrapper: "bg-[#2e2e2e] border-[#3b3b3b] hover:bg-[#3b3b3b]",
            }}
            onValueChange={setPassword}
          />
          {!!loginError && (
            <p className="text-red-600 font-normal text-center">{loginError}</p>
          )}
          <Button
            color="success"
            className="w-full font-medium bg-green-500 hover:bg-green-600 text-white"
            onClick={handleLogin}
            isLoading={loading}
          >
            Login
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-[#1a1a1a]">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SocialSignIn />
          </div>
          {/* <Button className="w-full font-medium bg-[#2e2e2e] text-white hover:bg-[#3b3b3b]">
            GitHub
          </Button> */}
        </CardBody>
      </Card>
    </div>
  );
}
