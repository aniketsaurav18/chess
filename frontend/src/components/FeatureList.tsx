import React from "react";
import { BrainCircuit, CircleHelp, Swords, Joystick, LineChart, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const reasons = [
  {
    title: "Online Multiplayer",
    description:
      "Play with people from all over the world. Compete with your friends and family.",
    icon: <Joystick />,
    link: "/game",
  },
  {
    title: "Play with AI (in-browser)",
    description:
      "Play with our powerful chess engine. Choose from different difficulty levels. Completely local, no server calls.",
    icon: <BrainCircuit />,
    link: "/computer",
  },
  {
    title: "Analyse your games",
    description:
      "Analyse your games with our powerful engine. Get insights and improve your game.",
    icon: <LineChart />,
    comingSoon: true,
  },
  {
    title: "Challenge your friends",
    description:
      "Create a room and invite your friends to play. Play with your friends in real-time.",
    icon: <Swords />,
    comingSoon: true,
  },
];

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  comingSoon?: boolean;
  link?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  comingSoon,
  link,
}) => {
  const navigate = useNavigate();
  return (
    <div className="group flex flex-col items-start bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-2xl transition-all duration-300 ease-in-out hover:bg-gray-800 h-full">
      <div className="mb-4 flex size-10 sm:size-12 items-center justify-center rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
        {React.cloneElement(icon, {
          className: "size-5 sm:size-6 text-blue-400",
        })}
      </div>
      <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-left mb-4 sm:mb-6 flex-grow text-sm sm:text-base">{description}</p>
      {comingSoon ? (
        <div className="mt-auto flex items-center text-gray-400 bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
          <CircleHelp className="size-3 sm:size-4 mr-1 sm:mr-2" />
          <span>Coming Soon</span>
        </div>
      ) : (
        <button
          className="mt-auto inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-gray-100 h-9 sm:h-10 px-4 sm:px-6 py-2"
          onClick={() => {
            if (link) {
              navigate(link);
            }
          }}
        >
          Try it
          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      )}
    </div>
  );
};

const FeatureList: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>
      <div className="container max-w-6xl px-4 mx-auto relative z-10">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold text-white">
            Powerful Features
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Elevate your chess game with our cutting-edge features
          </p>
        </div>
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-1 sm:gap-8">
          {reasons.map((reason, i) => (
            <FeatureCard key={i} {...reason} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureList;

