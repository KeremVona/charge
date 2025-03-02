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

// Fetch game details by ID
app.get("/api/games/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const game = result.rows[0];

    // Fetch players for this game
    const playersResult = await pool.query("SELECT * FROM players WHERE game_id = $1", [id]);

    // Return game details with players and rules
    res.json({
      ...game,
      players: playersResult.rows,
      rules: JSON.parse(game.rules), // Assuming rules are stored as JSON in DB
      plannedTime: game.planned_time, // Or other relevant field
      isHistorical: game.is_historical,
      isModded: game.is_modded,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch game details by ID
app.get("/api/games/:gameId", async (req, res) => {
  const { gameId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM games WHERE id = $1", [gameId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(result.rows[0]); // Return the game details
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch game details" });
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
    await pool.query(
      "INSERT INTO games (host, status, player_count, room_id) VALUES ($1, $2, $3, $4)",
      [newGame.host, newGame.status, newGame.player_count, newGame.room_id]
    );

    const updatedGames = await pool.query("SELECT * FROM games");
    io.emit("updateGames", updatedGames.rows);
  });

  socket.on("updateGame", async (updatedGame) => {
    // Update the game details in the database
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

    // Broadcast updated game info to all clients
    io.emit("updateGame", updatedGame);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from WebSocket");
  });
});

//server.listen(5001, () => console.log("Server running on port 5001"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));