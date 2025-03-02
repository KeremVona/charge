import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // WebSocket connection

const GameDetails = () => {
  const { gameId } = useParams(); // Get the game ID from URL parameters
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch game details when the component mounts
    fetch(`http://localhost:5000/api/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        setGameDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch game details");
        setLoading(false);
      });

    // Listen for game updates in real-time via WebSockets
    socket.on("updateGame", (updatedGame) => {
      if (updatedGame.id === parseInt(gameId)) {
        setGameDetails(updatedGame);
      }
    });

    return () => {
      socket.off("updateGame");
    };
  }, [gameId]); // Run again if gameId changes

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!gameDetails) return <div>Game not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Game Details: {gameDetails.host}</h1>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Host: {gameDetails.host}</h2>
          <p>Status: <span className={gameDetails.status === "hosted" ? "text-green-400" : "text-yellow-400"}>{gameDetails.status}</span></p>
        </div>

        {/* Display rules and players */}
        <div className="mb-4">
          <h3 className="font-semibold">General Rules</h3>
          <ul>
            {gameDetails.rules?.general?.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* Handle country-specific rules */}
        {gameDetails.rules?.countries?.map((country, idx) => (
          <div key={idx}>
            <h3 className="font-semibold">{country.name}</h3>
            <ul>
              {country.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDetails;