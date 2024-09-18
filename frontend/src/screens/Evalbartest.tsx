import { useState, useEffect } from "react";

const EvalBar = ({ evalScore }: any) => {
  const [whitePercent, setWhitePercent] = useState(50); // 50% for neutral

  useEffect(() => {
    // Normalize evalScore to a range between 0 and 100
    let evalRatio = 50; // Neutral
    if (evalScore > 0) {
      evalRatio = Math.min(100, 50 + evalScore * 5); // White winning
    } else if (evalScore < 0) {
      evalRatio = Math.max(0, 50 + evalScore * 5); // Black winning
    }
    setWhitePercent(evalRatio);
  }, [evalScore]);

  return (
    <div className="h-64 w-10 bg-gray-300 flex flex-col-reverse">
      <div
        className="bg-black"
        style={{ height: `${100 - whitePercent}%`, transition: "height 0.3s" }}
      ></div>
      <div
        className="bg-white"
        style={{ height: `${whitePercent}%`, transition: "height 0.3s" }}
      ></div>
    </div>
  );
};

const EvalBarPage = () => {
  const [evalScore, setEvalScore] = useState(0); // Example state for the evaluation score

  // Simulate score change (for testing purposes)
  const changeEval = () => {
    const newEval = Math.floor(Math.random() * 21 - 10); // Random value between -10 and +10
    setEvalScore(newEval);
  };

  return (
    <div className="p-4">
      <h1>Chess Evaluation Bar</h1>
      <EvalBar evalScore={evalScore} />
      <div className="mt-4">
        <button
          onClick={changeEval}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Change Evaluation
        </button>
        <p>Current Eval: {evalScore}</p>
      </div>
    </div>
  );
};

export default EvalBarPage;
