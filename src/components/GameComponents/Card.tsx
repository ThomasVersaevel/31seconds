import { useEffect, useState } from "react";
import { useGameSettings } from "../../context/GameSettingsContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useWords } from "../../context/WordsContext.tsx";

interface CardProps {
  currentTeamIndex: number;
}

export default function Card() {
  const location = useLocation();
  const { currentTeamIndex } = location.state as CardProps;
  const { countdownTime } = useGameSettings();
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const navigate = useNavigate();

  const { selectedCategories, getWords } = useWords();
  const [words, setWords] = useState<string[]>([]);

  // Prevent page refresh
  const preventRefresh = () => {
    return "data will get lost";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", preventRefresh);

    return () => {
      window.removeEventListener("beforeunload", preventRefresh);
    };
  }, []);

  // Only call getWords once when component mounts
  useEffect(() => {
    const savedWords = sessionStorage.getItem("gameWords");
    const savedTime = sessionStorage.getItem("timeLeft");

    if (savedWords) {
      setWords(JSON.parse(savedWords));
    } else {
      const selectedWords = getWords(selectedCategories);
      setWords(selectedWords);
      sessionStorage.setItem("gameWords", JSON.stringify(selectedWords));
    }

    if (savedTime) {
      setTimeLeft(Number(savedTime));
    }
  }, []);

  // Countdown timer logic with sessionStorage to prevent data loss on page refresh
  useEffect(() => {
    if (timeLeft <= 0) {
      sessionStorage.removeItem("gameWords");
      sessionStorage.removeItem("timeLeft");

      navigate("/game/scoring", {
        state: {
          currentTeamIndex,
          words,
        },
      });
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        const updated = prev - 1;
        sessionStorage.setItem("timeLeft", String(updated));
        return updated;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const percentage = (timeLeft / countdownTime) * 100;

  return (
    <div className="bg-sky-800 w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">
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
}
