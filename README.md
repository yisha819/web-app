**MOVIE WATCHLIST**

**Description**

The Movie Watchlist is a simple web application designed to help users keep track of their favorite movies and even track movies they would want to watch. With this app, users can:

- Add movies to their watchlist by providing a name, genre, status (watched or unwatched), and rating.
- View the full list of movies in their watchlist.
- Update movie details if needed.
- Remove movies from the list when they’ve been watched or are no longer of interest.

This project uses Node.js with Express for the backend and SQLite3 as the database. It's built to handle movie CRUD (Create, Read, Update, Delete) operations seamlessly.

**How to Clone and Run Locally**

_Prerequisites:_
1. Install Node.js (LTS version recommended)
2. Install SQLite3 if you want to inspect the database directly.

_Steps:_

1. Clone the Repository
  
   **git clone https://github.com/yisha819/web-app.git**

   **cd <repository_folder>**

4. Install Dependencies: Run the following command in the project directory to install required npm packages:

   **npm install**

3. Set up the Database: Initialize the database by running the following:

   **node setup.js**

4. Start the Server: launch the backend server using:

   **node server.js**

5. Test the Endpoints: Use a tool like Postman or curl to test the API endpoints:

   - GET /items - Fetch all movies.
   - POST /items - Add a new movie.
   - PUT /items/:id - Update a movie's details.
   - DELETE /items/:id - Remove a movie.

6. Access the Frontend (Optional), if you have a frontend:

   - Ensure its properly configured to connect to the backend (http://localhost:3000)
   - Open the frontend browser


