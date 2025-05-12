interface ReadyScreenProps {
  currentPlayer: string;
  currentTeam: string;
  onReady: () => void;
}

const ReadyScreen: React.FC<ReadyScreenProps> = ({
  currentPlayer,
  currentTeam,
  onReady,
}) => {
  return (
    <div className="bg-sky-800 w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center space-y-4">
      <h1>{currentTeam}</h1>
      <h2 className="mt-10 mb-10 text-xl font-bold text-gray-800">
        Player {currentPlayer} are you ready?
      </h2>
      <button
        type="button"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={onReady}
      >
        Next
      </button>
    </div>
  );
};

export default ReadyScreen;
