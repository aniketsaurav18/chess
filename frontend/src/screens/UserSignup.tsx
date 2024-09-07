import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function SignupPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [signUpError, setSignUpError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSignup = async () => {
    const newErrors = { ...errors };
    // Validate fields
    newErrors.name = name.trim() ? "" : "Name is required.";
    newErrors.email = /^\S+@\S+\.\S+$/.test(email)
      ? ""
      : "Valid email is required.";
    newErrors.username = username.trim() ? "" : "Username is required.";
    newErrors.password =
      password.length >= 6 ? "" : "Password must be at least 6 characters.";
    newErrors.confirmPassword =
      password === confirmPassword ? "" : "Passwords do not match.";

    setErrors(newErrors);

    // If no errors, proceed with signup logic
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }
    if (!hasErrors) {
      // Add signup logic here
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            username,
            password,
          }),
        });
        if (response.ok) {
          window.location.href = "/login";
          return;
        } else {
          const data = await response.json();
          setSignUpError(data.message);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }

      console.log("Sign up successful");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <Card className="w-full max-w-md bg-[#1a1a1a] border border-[#2e2e2e]">
        <CardHeader className="flex flex-col items-center pb-0 pt-6">
          <h2 className="text-3xl font-bold text-white">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?
            <Link
              href="/login"
              className="ml-1 text-green-400 hover:text-green-300"
            >
              Login
            </Link>
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            type="text"
            label="Name"
            variant="bordered"
            classNames={{
              label: "text-gray-400",
              input: "text-white",
              inputWrapper: "bg-[#2e2e2e] border-[#3b3b3b] hover:bg-[#3b3b3b]",
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            errorMessage={errors.name}
            isInvalid={!!errors.name}
          />
          <Input
            type="email"
            label="Email"
            variant="bordered"
            classNames={{
              label: "text-gray-400",
              input: "text-white",
              inputWrapper: "bg-[#2e2e2e] border-[#3b3b3b] hover:bg-[#3b3b3b]",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={errors.email}
            isInvalid={!!errors.email}
          />
          <Input
            type="text"
            label="Username"
            variant="bordered"
            classNames={{
              label: "text-gray-400",
              input: "text-white",
              inputWrapper: "bg-[#2e2e2e] border-[#3b3b3b] hover:bg-[#3b3b3b]",
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            errorMessage={errors.username}
            isInvalid={!!errors.username}
          />
          <Input
            label="Password"
            variant="bordered"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={errors.password}
            isInvalid={!!errors.password}
          />
          <Input
            label="Confirm Password"
            variant="bordered"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleConfirmVisibility}
              >
                {isConfirmVisible ? (
                  <EyeIcon className="text-2xl text-gray-400" />
                ) : (
                  <EyeOffIcon className="text-2xl text-gray-400" />
                )}
              </button>
            }
            type={isConfirmVisible ? "text" : "password"}
            classNames={{
              label: "text-gray-400",
              input: "text-white",
              inputWrapper: "bg-[#2e2e2e] border-[#3b3b3b] hover:bg-[#3b3b3b]",
            }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            errorMessage={errors.confirmPassword}
            isInvalid={!!errors.confirmPassword}
          />
          {!!signUpError && (
            <p className="text-red-600 font-normal text-center">
              {signUpError}
            </p>
          )}
          <Button
            color="success"
            className="w-full font-medium bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSignup}
            isLoading={loading}
          >
            Sign Up
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-[#1a1a1a]">
                Or sign up with
              </span>
            </div>
          </div>
          <Button className="w-full font-medium bg-[#2e2e2e] text-white hover:bg-[#3b3b3b]">
            GitHub
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
