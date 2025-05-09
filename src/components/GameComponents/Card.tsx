import React, { useContext, useEffect, useState } from "react";
import { useGameSettings } from "../../context/SettingsContext";
import { useNavigate } from "react-router-dom";

interface CardProps {
  words: string[];
}

const Card: React.FC<CardProps> = ({ words }) => {
  const { countdownTime } = useGameSettings();
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const navigate = useNavigate();

  // Reset timer when words change
  useEffect(() => {
    setTimeLeft(countdownTime);
  }, [words, countdownTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/game/scoring", { state: { words } });
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, navigate, words]);

  const percentage = (timeLeft / countdownTime) * 100;

  return (
    <div className="bg-white w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">
      <div className="mb-4 text-2xl font-bold text-red-600">{timeLeft}s</div>
      <div className="w-full h-3 mb-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {words.map((word, index) => (
        <div
          key={index}
          className="bg-blue-100 text-blue-800 py-3 px-4 rounded-lg text-lg font-medium shadow-sm w-full mb-2"
        >
          <b>{word}</b>
        </div>
      ))}
    </div>
  );
};

export default Card;
