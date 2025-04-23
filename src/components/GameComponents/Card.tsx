/* Get 5 items from the enabled categories. Reduce probability for each category after each pick to have a small amount of dupplicate categories. */
import React from "react";

interface CardProps {
  words: string[];
}

const Card: React.FC<CardProps> = ({ words }) => {
  return (
    <div className="bg-white w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">

      <ul className="space-y-3 w-full">
        {words.map((word, index) => (
          <li
            key={index}
            className="bg-blue-100 text-blue-800 py-3 px-4 rounded-lg text-lg font-medium shadow-sm"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Card;
