import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function ReadyScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const playerName = useState('');

  return (
    <div className="bg-white w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        Player playername are you ready?
      </h2>
      <button className="px-4 py-2 bg-gray-500 text-white rounded">Next</button>
    </div>
  );
}

export default ReadyScreen;
