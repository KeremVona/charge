import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/Button';

const GameDetails = () => {
  /*const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    console.log("gameId:", gameId); // Check if gameId is valid
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        const data = await response.json();
        console.log("Game details fetched:", data); // Log to verify the response
        setGameDetails(data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);*/

  const { gameId } = useParams(); // Get the gameId from the URL
  const navigate = useNavigate(); // Hook to navigate programmatically
  console.log("gameId from URL:", gameId); // Check if it's being passed correctly

  const [gameDetails, setGameDetails] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (gameId) {
      const fetchGameDetails = async () => {
        //const url = `/api/games/${gameId}`;
        const url = `http://localhost:5000/api/games/${gameId}`;
        console.log("Fetching from URL:", url); // Log the URL
        try {
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text(); // Get the response as text to check for error pages
          console.error("Error response:", text); // Log the response text (which may be HTML)
          return;
        }
        const data = await response.json();
        console.log("Game details fetched:", data);
        setGameDetails(data);
        setPlayers(data.players || []); // Set players list if available
        } catch (error) {
          console.error("Error fetching game details:", error);
        }
      };

      fetchGameDetails();
    }
  }, [gameId]);

  if (!gameDetails) {
    return <div>Loading game details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-4">Game Details</h1>
      
      <div className="space-y-4">
        <p className="text-lg"><strong>Host:</strong> {gameDetails.host}</p>
        <p className="text-lg"><strong>Status:</strong> {gameDetails.status}</p>
        <p className="text-lg"><strong>Player Count:</strong> {gameDetails.player_count}</p>
      </div>

        {/* Player List */}
      <h2 className="text-2xl font-semibold mt-6">Players</h2>
      <ul className="list-disc pl-6">
        {gameDetails.players && gameDetails.players.length > 0 ? (
          gameDetails.players.map((player, index) => (
            <li key={index} className="text-lg">{player}</li>
          ))
        ) : (
          <p>No players joined yet.</p>
        )}
      </ul>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Rules</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium">General Rules</h3>
            <ul className="list-disc pl-5">
              {gameDetails.rules.general && gameDetails.rules.general.map((rule, index) => (
                <li key={index} className="text-lg">{rule}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium">Country-Specific Rules</h3>
            <ul className="list-disc pl-5">
              {Object.entries(gameDetails.rules.countrySpecific).map(([country, rule], index) => (
                <li key={index} className="text-lg">{country}: {rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        
        <Button1 />
      </div>
    </div>
  );
};

export default GameDetails;