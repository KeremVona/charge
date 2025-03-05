/*import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const GameDetails = () => {
  const { gameId } = useParams(); // Get game ID from URL
  const [game, setGame] = useState(null);

  useEffect(() => {
    // Fetch game from server
    fetch(`http://localhost:5000/api/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => setGame(data))
      .catch((error) => console.error("Error fetching game:", error));

    // Listen for game updates
    socket.on("updateGame", (updatedGame) => {
      if (updatedGame.id === gameId) {
        setGame(updatedGame);
      }
    });

    return () => {
      socket.off("updateGame");
    };
  }, [gameId]);

  if (!game) {
    return <p>Loading game details...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Game Details</h2>
      <p><strong>Host:</strong> {game.host}</p>
      <p><strong>Status:</strong> {game.status}</p>
      <p><strong>Players:</strong> {game.player_count}</p>
      <p><strong>Room ID:</strong> {game.room_id || "N/A"}</p>
      <p><strong>Type:</strong> {game.is_historical ? "Historical" : "Unhistorical"}</p>
      <p><strong>Version:</strong> {game.is_modded ? "Modded" : "Vanilla"}</p>

      <h3 className="text-xl font-semibold mt-4">Game Rules</h3>
{game.rules ? (
  (() => {
    const parsedRules = typeof game.rules === "string" ? JSON.parse(game.rules) : game.rules;

    return (
      <div>
        <h4 className="font-medium">General Rules</h4>
        {parsedRules.general && parsedRules.general.length > 0 ? (
          <ul>
            {parsedRules.general.map((rule, index) => (
              <li key={index}>- {rule}</li>
            ))}
          </ul>
        ) : (
          <p>No general rules specified.</p>
        )}

        {parsedRules.countrySpecific &&
          Object.keys(parsedRules.countrySpecific).map((country) => (
            <div key={country}>
              <h4 className="font-medium mt-4">{country} Rules</h4>
              <ul>
                {parsedRules.countrySpecific[country].map((rule, index) => (
                  <li key={index}>- {rule}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    );
  })()
) : (
  <p>No rules specified.</p>
)}
    </div>
  );
};

export default GameDetails;*/

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