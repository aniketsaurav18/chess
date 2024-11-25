import { useNavigate } from "react-router-dom";
import FeatureList from "../components/FeatureList";
import { Navbar } from "../components/Navbar";
import { FaGithub } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const handlePlayNow = () => {
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
      <Navbar />
      {/* Hero Section */}

      <div className="flex min-h-[650px] items-center px-6 lg:px-8">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-6xl sm:text-4xl font-bold tracking-tight">
            Play Chess With your Friends
          </h1>
          <p className="mt-6 text-xl sm:text-lg text-gray-600">
            Master the board your way - Play online or challenge our powerful
            chess engine!
          </p>

          {/* Buttons */}
          <div className="mt-8 flex items-center gap-4">
            {/* <button
              className="rounded-lg bg-gray-600 px-6 sm:px-4 sm:py-2 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              onClick={() => navigate("/signup")}
            >
              Star on Github
            </button> */}
            <button
              className="flex items-center justify-center gap-2 border-none bg-gray-600 hover:bg-gray-700 px-5 sm:px-4 sm:py-[0.5rem] py-[0.6rem] transition duration-300 rounded-lg"
              onClick={() => {
                window.open("https://github.com/aniketsaurav18/chess");
              }}
            >
              <FaGithub className="text-white text-2xl" />
              <p className="text-white text-sm font-bold transition duration-300">
                Star on Github
              </p>
            </button>
            <button
              className="group flex items-center gap-2 rounded-lg px-6 sm:px-4 sm:py-2 py-3 text-sm font-semibold transition-colors bg-green-600 hover:bg-green-700"
              onClick={handlePlayNow}
            >
              Get Started
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Logo */}
        {/* <div className="hidden lg:block">
          <div className="relative h-64 w-64">
            <div className="absolute inset-0 bg-black [mask-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_8px)]" />
            <div className="absolute inset-0 transform rotate-45 bg-black [mask-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_8px)]" />
          </div>
        </div> */}
      </div>

      {/* Features Section */}
      <FeatureList />

      {/* Call to Action */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gray-800">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Master Your Game?
        </h2>
        <button className="bg-green-500 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-green-400 transition">
          Join Us
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center">
        <p className="text-gray-500">
          © 2024 Chess Master. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
