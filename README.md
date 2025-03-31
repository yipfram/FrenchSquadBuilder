
# Football Team Builder

A web application for building and managing football teams with drag-and-drop functionality, built with React, TypeScript, and Express.

## Features

- Drag-and-drop interface for player positioning
- Player selection with detailed stats
- Team formation management
- Real-time team power score calculation
- Responsive design for all screen sizes

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, React Query, React DND
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Building**: Vite

## Getting Started

1. Click the "Run" button to start the development server
2. The application will be available at the URL provided
3. Frontend runs on port 5000 in development

## Project Structure

```
├── client/           # Frontend React application
├── server/           # Express backend
├── shared/           # Shared types and schemas
└── attached_assets/  # Static assets
```

## Features

### Player Management
- View player details including position, club, and rating
- Drag and drop players to assign positions
- Remove players from positions

### Team Building
- Multiple formation support
- Real-time team updates
- Position-specific player suggestions

### Team Comparison
- Compare different team configurations
- Analyze team strengths and weaknesses

## API Endpoints

- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
