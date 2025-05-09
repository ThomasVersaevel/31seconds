import React from "react";
import { useGameSettings } from "../context/SettingsContext";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const { countdownTime, setCountdownTime, targetScore, setTargetScore } =
    useGameSettings();
    const navigate = useNavigate();

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Game Settings
      </h2>

      <form className="space-y-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="targetScore"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
          >
            Points needed to win the game
          </label>
          <input
            id="targetScore"
            type="number"
            min={1}
            value={targetScore}
            onChange={(e) => setTargetScore(parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="roundTime"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
          >
            Round Time (seconds)
          </label>
          <input
            id="roundTime"
            type="number"
            min={5}
            value={countdownTime}
            onChange={(e) => setCountdownTime(parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => navigate("/")}
        >Save and exit</button>
      </form>
    </div>
  );
};

export default Settings;
