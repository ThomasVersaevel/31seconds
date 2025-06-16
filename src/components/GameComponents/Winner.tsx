import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamContext";

const Winner = () => {
  const navigate = useNavigate();
  const [showAirplanes, setShowAirplanes] = useState(false);
  const colors = [
    "gold",
    "red",
    "blue",
    "lime",
    "cyan",
    "magenta",
    "orange",
    "white",
  ];

  const { teams, resetPoints } = useTeams();

  useEffect(() => {
    // Determine scene with 10% airplane, 90% fireworks
    const randomChance = Math.random();
    setShowAirplanes(randomChance < 0.15);
  }, []);

  // Reset points and index for all teams
  const playAgain = () => {
    resetPoints();
    navigate("/game");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-t from-sky-800 to-sky-700 p-4">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        Congratulations!
      </h1>
      <h1 className="text-3xl font-bold text-sky-300">
        {teams.reduce((prev, curr) => (curr.points > prev.points ? curr : prev))
          .name ?? ""}
      </h1>

      <button
        onClick={playAgain}
        className="mt-6 w-75 px-6 py-3 bg-sky-600 text-white rounded-lg text-lg shadow hover:bg-sky-700"
      >
        Play Again
      </button>
      <button
        onClick={() => navigate("/")}
        className="mt-6 w-75 px-6 py-3 bg-sky-600 text-white rounded-lg text-lg shadow hover:bg-sky-700"
      >
        Main Menu
      </button>

      <div className="mt-auto text-lg font-semibold mt-4 space-y-1">
        {teams.map((team, index) => (
          <div key={index}>
            <span className="text-slate-400">{team.name}:</span>{" "}
            <span className="text-slate-300">{team.points} points</span>
          </div>
        ))}
      </div>

      {showAirplanes ? (
        <div className="airplane-scene">
          <div className="vertical-rectangle"></div>
          <div className="vertical-rectangle2"></div>
          <div className="airplane"></div>
          <div className="airplane2"></div>
          <div className="explosion explosion1"></div>
          <div className="explosion explosion2"></div>
        </div>
      ) : (
        <div className="fireworks-container">
          {[...Array(8)].map((_, i) => {
            const left = Math.random() * 100; // random horizontal position (0–100vw)
            const delay = Math.random() * 2; // delay between 0–2 seconds
            const riseHeight = 10 + Math.random() * 20; // between 10vh and 30vh
            const scale = 0.8 + Math.random() * 1.2; // explosion scale between 0.8–2
            const color = colors[Math.floor(Math.random() * colors.length)];

            return (
              <div
                key={i}
                className="firework"
                style={
                  {
                    left: `${left}vw`,
                    animationDelay: `${delay}s`,
                    "--rise-height": `${riseHeight}vh`,
                    "--explode-scale": scale,
                    "--firework-color": color,
                  } as React.CSSProperties
                }
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Winner;
