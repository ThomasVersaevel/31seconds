/* Get 5 items from the enabled categories. Reduce probability for each category after each pick to have a small amount of dupplicate categories. */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  words: string[];
}

const Card: React.FC<CardProps> = ({ words }) => {
  const [timeLeft, setTimeLeft] = useState(31);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeLeft(31); // reset timer on new card
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
  }, [timeLeft, navigate]);


  
  return (
    <>
    <div className="bg-white w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">
      {words.map((word, index) => (
        <p
          key={index}
          className="bg-blue-100 text-blue-800 py-3 px-4 rounded-lg text-lg font-medium shadow-sm"
        >
          <b>{word}</b>
        </p>
      ))}
    </div></>
  );
};

export default Card;
