import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const socket = io("http://localhost:5000"); // WebSocket connection

const GameList = () => {
  const [games, setGames] = useState([]);

  // Fetch games on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((error) => console.error("Error fetching games:", error));

    // Listen for game updates via WebSockets
    socket.on("updateGames", (updatedGames) => {
      setGames(updatedGames);
    });

    return () => {
      socket.off("updateGames"); // Cleanup WebSocket listener on unmount
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Game List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">
              <Link to={`/game/${game.id}`} className="text-blue-500 hover:underline">
                Host: {game.host}
              </Link>
            </h2>
            <p>Status: <span className={game.status === "hosted" ? "text-green-400" : "text-yellow-400"}>{game.status}</span></p>
            <p>Players: {game.player_count}</p>
            {game.room_id && <p>Room ID: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{game.room_id}</span></p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;