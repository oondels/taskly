# Task Management Application

Welcome to **Taskly** the **Task Management Application**! This application allows users to manage their daily tasks efficiently, providing both local authentication using username/password and social login through OAuth2 (e.g., Google). This repository aims to serve as a personal or professional project to showcase skills in fullstack development, with a focus on backend integration.

## Features

- **User Registration and Authentication**: Secure registration and login using JWT-based authentication.
- **OAuth2 Integration**: Social login using Google for easier access and flexibility.
- **Task CRUD Operations**: Create, read, update, and delete tasks.
- **Password Security**: User passwords are hashed using bcrypt to ensure data safety.
- **Token-based Authentication**: Stateless authentication with JWT stored in HTTP-only cookies.
- **Protected Routes**: Only authenticated users can access certain resources.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: React
- **Authentication**: Passport.js, JWT, OAuth2 (Google)
- **Database**: PostgreSQL (AWS)
- **Others**: bcrypt for password hashing, cookie-parser for handling cookies

## Getting Started

### Prerequisites

- **Node.js**: Version 14 or above
- **PostgreSQL**: For storing user and task data
- **npm**: Node Package Manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/oondels/taskly.git
   cd taskly
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following values:

   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   DATABASE_URL=your_database_url
   NODE_ENV=development
   ```

4. Set up the database:

   - Make sure PostgreSQL is installed and running.
   - Create the necessary tables.

5. Start the application:
   ```bash
   npm start
   ```

## Usage

- **Register/Login**: Users can register using their email/password or log in with their Google account.
- **Manage Tasks**: Users can create, update, and delete their tasks.
- **Authentication**: After login, users receive a JWT token, which is used for accessing protected routes.

## Project Structure

- **server/**: Contains all backend code (Express.js routes, authentication, etc.).
- **client/**: Contains all frontend code (React components).
- **utils/**: Utility functions, including helpers for authentication and password validation.
- **db/**: Database connection and queries.

## Future Improvements

- **Add Role-Based Access Control (RBAC)**: To differentiate between different types of users (e.g., admin, user).
- **Implement Notifications**: Notify users when tasks are due.
- **Add Unit Testing**: Using Jest or Mocha for better reliability.

## Contributing

Feel free to open issues or submit pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for details.
