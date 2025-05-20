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

      setTimeout(() => {
        sessionStorage.removeItem("gameWords");
        sessionStorage.removeItem("timeLeft");

        navigate("/game/scoring", {
          state: {
            currentTeamIndex,
            words,
          },
        });
      }, 1000); // Delay navigation by 100ms
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

  return (
    <div className="h-dvh w-full h-screen m-auto p-6 bg-sky-800 min-h-screen flex flex-col items-center text-center">
      <div className="m-auto">
        <div
          className={`mb-4 text-3xl font-bold ${
            timeLeft / countdownTime < 0.3
              ? "text-red-500 animate-danger-pulse"
              : "text-orange-500"
          }`}
        >
          {timeLeft}s
        </div>

        <div className="w-75 h-3 mb-6 bg-blue-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft / countdownTime < 0.3
                ? "bg-red-500 animate-danger-pulse"
                : "bg-orange-500"
            }`}
            style={{
              width: `${(timeLeft / countdownTime) * 100}%`,
            }}
          ></div>
        </div>
        {words.map((word, index) => (
          <div
            key={index}
            className="z-1 bg-blue-100 text-black py-3 px-4 rounded-lg text-lg font-medium shadow-sm w-75 mb-2"
          >
            <b>{word}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
