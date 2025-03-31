Hearts of Iron IV Muliplayer Game Finder

Overview

The Hearts of Iron 4 Multiplayer Game Finder is a web-based platform that allows players to list, find, and join Hearts of Iron 4 (HOI4) multiplayer games. Hosts can create game listings, and players can join active or scheduled matches, making it easier to organize and participate in multiplayer sessions.

Features

User Registration & Login: Secure authentication system for players.

Game Listings: Players can browse and filter listed multiplayer games.

Game Hosting: Users can create and manage their game listings.

Join System: Players can join listed games, and the player count updates in real-time.

Player List: Display usernames of players who joined a game.

Live Updates: WebSockets ensure real-time updates for player count and game listings.

Game Details Page: View detailed information about a specific game listing.

Tech Stack

Frontend: React, JavaScript, Tailwind CSS

Backend: Node.js, Express.js

Database: PostgreSQL

Real-Time Updates: WebSockets

Voice Chat: PeerJS

Installation

Clone the repository

git clone https://github.com/your-username/hoi4-multiplayer-game-finder.git
cd hoi4-multiplayer-game-finder

Install dependencies

npm install

Set up environment variables
Create a .env file and configure your database, WebSocket server, and PeerJS settings.

Run the development server

npm run dev

Usage

Register/Login to create an account.

Browse the list of active or scheduled HOI4 games.

Host a game by providing details such as game mode and rules.

Join a game to participate in a multiplayer session.

Use built-in voice chat for pre-game discussions and coordination.

Future Enhancements

Faction-Based Voice Chat Rooms: Separate voice channels for in-game factions.

Game Host Controls: Hosts can kick players, lock teams, and modify rules mid-lobby.

Matchmaking System: Automated player matching for balanced games.

User Profiles: Track statistics, favorite nations, and preferred playstyles.

Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

License

This project is licensed under the MIT License.

Contact

For any questions or feedback, reach out via [your email or Discord].



![Ekran görüntüsü 2025-03-18 143929](https://github.com/user-attachments/assets/6a18be6e-84aa-4e87-90c1-7581e210ca89)

![Ekran görüntüsü 2025-03-18 143949](https://github.com/user-attachments/assets/d6716d84-eb1c-412d-a108-42aafd2495a4)

![Ekran görüntüsü 2025-03-18 144030](https://github.com/user-attachments/assets/ee3e7cd8-c7a2-4686-865a-6fe83d478b5a)

To run locally:

in bash terminal, npm install,
cd charge,
npm install,
npm run dev

in another terminal npm install,
cd charge,
npm install,
node server.js
