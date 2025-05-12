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
    <div className="w-full h-screen min-h-screen bg-sky-800 p-6 flex flex-col text-center">
      <h2 className="text-xl font-bold text-sky-300 mb-auto">{currentTeam}</h2>
      <h2 className="m-auto text-2xl font-bold text-gray-200">
        Player <br /> {currentPlayer} <br />
        are you ready?
      </h2>
      <button
        type="button"
        className="w-full mt-auto px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-opacity-50"
        onClick={onReady}
      >
        Next
      </button>
    </div>
  );
};

export default ReadyScreen;
