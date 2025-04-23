/* Show the same items from the current card but with checkboxes and add ticked items to score of the current team */
/* Get 5 items from the enabled categories. Reduce probability for each category after each pick to have a small amount of dupplicate categories. */
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function ScoringScreen() {
  const [timeLeft, setTimeLeft] = useState(31);
  const navigate = useNavigate();
  const location = useLocation();
  const words: string[] = location.state?.words || [];
  
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
        </div>
    </>
  );
};

export default ScoringScreen;
