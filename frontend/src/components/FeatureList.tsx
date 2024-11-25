import React from "react";
import {
  BrainCircuit,
  CircleHelp,
  Swords,
  Joystick,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const reasons = [
  {
    title: "Online Multiplayer",
    description:
      "Play with people from all over the world. Compete with your friends and family.",
    icon: <Joystick className="size-8" />,
    link: "/game",
  },
  {
    title: "Play with AI (in-browser)",
    description:
      "Play with our powerful chess engine. Choose from different difficulty levels. Completely local, no server calls.",
    icon: <BrainCircuit className="size-8" />,
    link: "/computer",
  },
  {
    title: "Analyse your games",
    description:
      "Analyse your games with our powerful engine. Get insights and improve your game.",
    icon: <LineChart className="size-8" />,
    comingSoon: true,
  },
  {
    title: "Challenge your friends",
    description:
      "Create a room and invite your friends to play. Play with your friends in real-time.",
    icon: <Swords className="size-8" />,
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
    <div className="group flex flex-col items-start bg-gray-800 p-5 sm:p-4 rounded-xl hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-700 h-full">
      <div className="mb-2 flex size-14 sm:size-12 items-center justify-center rounded-full bg-gray-700 group-hover:bg-gray-600 transition-colors duration-300">
        {React.cloneElement(icon, {
          className:
            "size-6 transition-transform duration-300 group-hover:scale-110",
        })}
      </div>
      <h3 className="mb-3 text-xl sm:text-lg font-bold text-white">{title}</h3>
      <p className="text-gray-300 text-left mb-4 flex-grow">{description}</p>
      {comingSoon ? (
        <div className="mt-auto flex items-center text-primary-foreground bg-gray-600 px-3 sm:px-2 py-1 sm:py-1 rounded-full text-sm">
          <CircleHelp className="size-4 mr-2" />
          <span>Coming Soon</span>
        </div>
      ) : (
        <button
          className="mt-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-primary-foreground hover:bg-green-700 h-10 px-4 py-2"
          onClick={() => {
            if (link) {
              navigate(link);
            }
          }}
        >
          Try it
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const FeatureList: React.FC = () => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-6 text-center">
          <h2 className="mb-8 sm:mb-4 text-4xl sm:text-3xl font-bold text-white">
            Powerful Features
          </h2>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-1">
          {reasons.map((reason, i) => (
            <FeatureCard key={i} {...reason} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureList;
