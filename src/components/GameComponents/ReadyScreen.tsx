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
    <div className="bg-sky-800 w-full h-full max-w-sm p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center space-y-4">
      <h2 className="text-xl font-bold text-sky-500">{currentTeam}</h2>
      <h2 className="mt-5 mb-12 text-xl font-bold text-gray-200">
        Player {currentPlayer} are you ready?
      </h2>
      <button
        type="button"
        className="w-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-opacity-50"
        onClick={onReady}
      >
        Next
      </button>
    </div>
  );
};

export default ReadyScreen;
