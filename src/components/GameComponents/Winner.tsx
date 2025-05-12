import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface WinnerProps {
  teamName: string;
}

const Winner: React.FC<WinnerProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamName } = location.state as WinnerProps;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-sky-800 p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Congratulations!
      </h1>
      <h1>{teamName}</h1>

      <button
        onClick={() => navigate("/game")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow hover:bg-blue-700"
      >
        Play Again
      </button>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow hover:bg-blue-700"
      >
        Main Menu
      </button>
    </div>
  );
};

export default Winner;
