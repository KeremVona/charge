import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./authRoutes.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import pool from "./db.js"; // PostgreSQL database connection

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

// Fetch all games
app.get("/api/games", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM games");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2

//app.get gamesid

// Fetch game details by ID
app.get("/api/games/:gameId", async (req, res) => {
  const { gameId } = req.params;
  try {
    // Fetch game details including player_count
    const result = await pool.query("SELECT * FROM games WHERE id = $1", [gameId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const game = result.rows[0];

    // Ensure rules is parsed only if it's a string
    const parsedRules = typeof game.rules === 'string' ? JSON.parse(game.rules) : game.rules;

    // Return game details with player_count
    res.json({
      ...game,
      player_count: game.player_count, // Include player_count from games table
      rules: parsedRules || { general: [], countrySpecific: {} },
      plannedTime: game.planned_time,
      isHistorical: game.is_historical,
      isModded: game.is_modded,
    });
  } catch (err) {
    console.error('Error fetching game details:', err);
    res.status(500).json({ error: err.message });
  }
});

// WebSocket connection for real-time updates
/*io.on("connection", (socket) => {
  console.log("A user connected to WebSocket");

  socket.on("addGame", async (newGame) => {
    await pool.query(
      "INSERT INTO games (host, status, player_count, room_id) VALUES ($1, $2, $3, $4)",
      [newGame.host, newGame.status, newGame.player_count, newGame.room_id]
    );

    // Broadcast updated game list to all clients
    const updatedGames = await pool.query("SELECT * FROM games");
    io.emit("updateGames", updatedGames.rows);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from WebSocket");
  });
});*/

io.on("connection", (socket) => {
  console.log("A user connected to WebSocket");

  socket.on("addGame", async (newGame) => {
    try {
      await pool.query(
        "INSERT INTO games (host, status, player_count, room_id, rules, is_historical, is_modded) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          newGame.host,
          newGame.status,
          newGame.player_count,
          newGame.room_id,
          JSON.stringify(newGame.rules),
          newGame.is_historical, // Include historical status
          newGame.is_modded, // Include modded status
        ]
      );
  
      // Fetch updated game list and broadcast it
      const updatedGames = await pool.query("SELECT * FROM games");
      io.emit("updateGames", updatedGames.rows);
    } catch (err) {
      console.error("Error adding game:", err);
    }
  });
  

  socket.on("updateGame", async (updatedGame) => {
    try {
      await pool.query(
        "UPDATE games SET rules = $1, planned_time = $2, is_historical = $3, is_modded = $4 WHERE id = $5",
        [
          JSON.stringify(updatedGame.rules),
          updatedGame.plannedTime,
          updatedGame.isHistorical,
          updatedGame.isModded,
          updatedGame.id,
        ]
      );
  
      // Fetch the full updated game from the database before broadcasting
      const result = await pool.query("SELECT * FROM games WHERE id = $1", [updatedGame.id]);
      const fullGame = result.rows[0];
  
      // Ensure rules are properly parsed
      fullGame.rules = fullGame.rules ? JSON.parse(fullGame.rules) : { general: [], countrySpecific: {} };
  
      io.emit("updateGame", fullGame);
    } catch (err) {
      console.error("Error updating game:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from WebSocket");
  });
});

//server.listen(5001, () => console.log("Server running on port 5001"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));