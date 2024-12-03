const db = require('../database/db');

//FETCH MOVIES
const getAllMovies = (callback) => {
    db.all("SELECT * FROM movies", [], (err,rows) => {
        callback(err,rows);
    });
};

//ADD MOVIE
const addMovie = (movie, callback) => {
    const { title, description, year} = movie;
    db.run(
        "INSERT INTO movies (title, description, year) VALUES (?,?,?)",
        [title, description, year],
        function (err) {
            callback(err, this.lastID);
        }
    );
};

//UPDATE MOVIE
const updateMovie = (id, movie, callback) => {
    const { title, description, year } = movie;
    db.run (
        "UPDATE movies SET title = ?, description = ?, year = ? WHERE id = ?",
        [title, description, year, id],
        function (err) {
            callback(err,this.changes);
        }
    );
};

//DELETE MOVIE
const deleteMovie = (id, callback) => {
    db.run("DELETE FROM movies WHERE id = ?", [id], function (err) {
        callback(err, this.changes);
    });
};

module.exports = { getAllMovies, addMovie, updateMovie, deleteMovie };

