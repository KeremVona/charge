import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // WebSocket connection

const GameAdd = () => {
  const [host, setHost] = useState("");
  const [status, setStatus] = useState("planned");
  const [playerCount, setPlayerCount] = useState(1);
  const [roomId, setRoomId] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new game object
    const newGame = {
      host,
      status,
      player_count: playerCount,
      room_id: roomId || null,
    };

    // Emit the 'addGame' event to WebSocket server
    socket.emit("addGame", newGame);

    // Reset the form after submission
    setHost("");
    setStatus("planned");
    setPlayerCount(1);
    setRoomId("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Host a New Game</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div>
          <label htmlFor="host" className="block text-sm font-semibold text-gray-300">Host Name</label>
          <input
            type="text"
            id="host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="mt-1 block w-full p-2 rounded-md border border-gray-700 bg-gray-900 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-300">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full p-2 rounded-md border border-gray-700 bg-gray-900 text-white"
          >
            <option value="planned">Planned</option>
            <option value="hosted">Hosted</option>
          </select>
        </div>

        <div>
          <label htmlFor="playerCount" className="block text-sm font-semibold text-gray-300">Player Count</label>
          <input
            type="number"
            id="playerCount"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            min="1"
            className="mt-1 block w-full p-2 rounded-md border border-gray-700 bg-gray-900 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="roomId" className="block text-sm font-semibold text-gray-300">Room ID (Optional)</label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mt-1 block w-full p-2 rounded-md border border-gray-700 bg-gray-900 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Make Game
        </button>
      </form>
    </div>
  );
};

export default GameAdd;