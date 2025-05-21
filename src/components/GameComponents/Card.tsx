import { useEffect, useRef, useState } from "react";
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
  const randoms = useRef(
    // useRef here makes sure it doesnt re-random the values on a re-render
    [...Array(7)].map(() => ({
      left: 5 + Math.random() * 95, // Random position between 5vw and 95vw
      delay: Math.random() * 5, // Animation delay between 0–2s
      riseHeight: 10 + Math.random() * 80, // Rise height between 10vh and 100vh
      scale: 0.8 + Math.random() * 3, // Scale between 0.8 and 2.0
    }))
  );

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
    <div className="relative h-dvh w-full bg-sky-800 overflow-hidden">
      <div
        className="bottom-0 w-full absolute bg-sky-600 opacity-30 z-0 transition-all duration-1000 ease-linear"
        style={{ height: `${(timeLeft / countdownTime) * 100}%` }}
      >
        <div className="wave absolute top-0 left-0 w-full h-6"></div>
      </div>

      <div>
        {randoms.current.map((bubble, i) => {
          const visible = bubble.riseHeight <= (timeLeft / countdownTime) * 100;
          return (
            <div
              key={i}
              className="bubble absolute bottom-0"
              style={
                {
                  left: `${bubble.left}vw`,
                  animationDelay: `${bubble.delay}s`,
                  visibility: visible ? "visible" : "hidden",
                  "--rise-height": `${bubble.riseHeight}vh`,
                  "--bubble-size": bubble.scale,
                } as React.CSSProperties
              }
            ></div>
          );
        })}
      </div>

      <div className="relative z-10 h-full flex flex-col items-center text-center p-6">
        <div className="m-auto">
          <div
            className={`mb-4 text-3xl font-bold ${
              timeLeft / countdownTime < 0.3
                ? "text-red-500 animate-text-pulse"
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
    </div>
  );
}
