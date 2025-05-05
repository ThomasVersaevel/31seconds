/* Get 5 items from the enabled categories. Reduce probability for each category after each pick to have a small amount of dupplicate categories. */
import React, { useContext, useEffect, useState } from "react";
import { useGameSettings } from "../../context/settingsContext";
import { useNavigate } from "react-router-dom";

interface CardProps {
  words: string[];
}

const Card: React.FC<CardProps> = ({ words }) => {
  const { countdownTime } = useGameSettings();
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeLeft(countdownTime); // reset timer on new card
  }, [words]);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/scoring", { state: { words: words } }); //
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, navigate, words]);


  
  return (
    <>
    <div className="bg-white w-full space-y-3 max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">
      {words.map((word, index) => (
        <div className="bg-blue-100  w-full text-blue-800 py-3 px-4 rounded-lg text-lg font-medium shadow-sm">
        <p
          key={index}
          
        >
          <b>{word}</b>
        </p>
        </div>
      ))}
    </div></>
  );
};

export default Card;
