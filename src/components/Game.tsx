/* Cycle between players and show them the 'ready' screen with scoreboard in the bottom 
 * When clicking large ready button show the player 5 randomly selected words to explain to their teammates
 * Start a 31 second timer and when it ends buzz or pop another colored screen to tick the options guessed correctly, then add the points
 * Mark the used 5 words such that they dont show up again this game
 * Cycle to a new player and have them pass the phone
*/
import React, { useState } from "react";
import Card from "./GameComponents/Card";
import { useWordPool } from "../utils/useWordPool";

const wordsList = [
  "Balloon", "Tent", "Flashlight", "Saxophone", "Pizza",
  "Banana", "Spaceship", "Tiger", "Laptop", "Whistle", "Grote drol"
];

export function Game() {
  const { getNextWords, reset, isEmpty } = useWordPool(wordsList);
  const [cardWords, setCardWords] = useState<string[]>(getNextWords(5));

  const handleNext = () => {
    const next = getNextWords(5);
    if (next.length === 0) {
      alert("Out of words! Resetting...");
      reset();
      setCardWords(getNextWords(5));
    } else {
      setCardWords(next);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 px-4">
      <Card words={cardWords} />
      <button
        onClick={handleNext}
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg"
        disabled={isEmpty}
      >
        Next Card
      </button>
    </div>
  );
}
