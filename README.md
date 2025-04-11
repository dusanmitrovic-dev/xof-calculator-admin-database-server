# Guild API

A Node.js backend API server using Express and MongoDB (Mongoose) to manage configurations and earnings for different guilds.

## Features

*   **Guild Configuration:**
    *   Create, Read, Update, Delete (CRUD) operations for guild-specific configurations.
    *   Manage models, shifts, periods, bonus rules, display settings, commission settings, and roles per guild.
    *   Endpoints to get/update specific configuration fields.
*   **Earnings Tracking:**
    *   CRUD operations for earnings records associated with a guild.
    *   Store details like date, revenue, period, shift, role, models worked, hours, and user.

## Project Structure

```
.
├── .env                # Environment variables (MongoDB URI, Port)
├── config/
│   └── db.js           # MongoDB connection logic
├── controllers/        # Request handling logic
│   ├── configController.js
│   └── earningController.js
├── models/             # Mongoose schemas and models
│   ├── Earning.js
│   └── GuildConfig.js
├── routes/             # API route definitions
│   ├── configRoutes.js
│   └── earningRoutes.js
├── server.js           # Main application entry point
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Prerequisites

*   Node.js (v14 or higher recommended)
*   npm or yarn
*   MongoDB instance (local or cloud-based like MongoDB Atlas)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd guild-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    *   Create a `.env` file in the root directory.
    *   Add the following variables:
        ```env
        MONGO_URI=<your_mongodb_connection_string>
        PORT=5000
        ```
    *   Replace `<your_mongodb_connection_string>` with your actual MongoDB connection URI (e.g., `mongodb://localhost:27017/guild_db` for a local database named `guild_db`).

## Running the Server

*   **Development mode (with automatic restarts):**
    ```bash
    npm run dev
    ```
*   **Production mode:**
    ```bash
    npm start
    ```

The server will start on the port specified in your `.env` file (default is 5000).

## API Endpoints

**Base URL:** `/api`

### Configuration (`/api/config`)

*   `GET /`: Get all guild configurations.
*   `POST /`: Create a new guild configuration or update an existing one (based on `guild_id` in the request body).
*   `GET /:guild_id`: Get the configuration for a specific guild.
*   `DELETE /:guild_id`: Delete the configuration for a specific guild.
*   `GET /:guild_id/:field`: Get a specific field (e.g., `models`, `shifts`, `display_settings`) from a guild's configuration.
*   `PUT /:guild_id/:field`: Update a specific field in a guild's configuration. The request body should be `{"value": <new_value>}`.

### Earnings (`/api/earnings`)

*   `GET /:guild_id`: Get all earnings records for a specific guild.
*   `POST /:guild_id`: Create a new earning record for a specific guild.
*   `GET /entry/:earning_id`: Get a specific earning record by its MongoDB `_id`.
*   `PUT /entry/:earning_id`: Update a specific earning record by its `_id`.
*   `DELETE /entry/:earning_id`: Delete a specific earning record by its `_id`.

## TODO / Potential Improvements

*   **Authentication & Authorization:** Secure endpoints to ensure only authorized users/bots can modify data.
*   **Input Validation:** Add more robust input validation (e.g., using `express-validator`).
*   **Error Handling:** Implement more specific error handling and logging.
*   **Testing:** Add unit and integration tests.
*   **Data Seeding:** Create scripts to populate initial data.
*   **API Documentation:** Use tools like Swagger/OpenAPI for better documentation.
*   **Relationship Management:** Consider using Mongoose population if relationships between models become more complex (e.g., linking earnings directly to User documents).
