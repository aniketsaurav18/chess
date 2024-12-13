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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Top Badge */}
        <div className="relative mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <span className="text-gray-400 text-sm sm:text-base">Elevate your chess game!</span>
            <span className="text-blue-400 flex items-center gap-1 text-sm sm:text-base">
              Learn More
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative w-full max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 px-4">
          <h1 className="sm:text-4xl md:text-5xl lg:text-6xl text-7xl font-bold tracking-tight leading-tight">
            Play Chess With Friends
            <span className="block">Without Boundaries</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-400">
            Master the board your way - Play online or challenge our powerful
            chess engine in a seamless and engaging experience.
          </p>

          {/* Buttons */}
          <div className="flex sm:flex-col flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <button
              onClick={handlePlayNow}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start for free
            </button>
            <button
              onClick={() => {
                window.open("https://github.com/aniketsaurav18/chess");
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white border border-gray-800 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaGithub className="h-6 w-6" />
              Star on Github
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <FeatureList />

      {/* Call to Action */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
        <div className="relative z-10 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">
            Ready to Master Your Game?
          </h2>
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300">
            Join Us Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 text-center">
        <p className="text-gray-500">
          © 2024 Chess Master. All Rights Reserved.
        </p>
        <p className="mt-2">
          Made with ❤️ by{" "}
          <a 
            href="https://saurav.co/" 
            className="text-blue-400 hover:text-blue-300 transition-colors" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Saurav Sharma
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

