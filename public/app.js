// Get references to elements
const addMovieBtn = document.getElementById('add-movie-btn');
const movieModal = document.getElementById('movie-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const movieForm = document.getElementById('movie-form');
const movieTitleInput = document.getElementById('movie-title');
const movieGenreInput = document.getElementById('movie-genre');
const movieStatusInput = document.getElementById('movie-status');
const movieRatingInput = document.getElementById('movie-rating');
const library = document.getElementById('library');

let editingMovieId = null; // To keep track of the movie being edited

// Open the movie modal
addMovieBtn.addEventListener('click', () => {
    movieModal.classList.remove('hidden');
    resetForm();  // Reset form for adding a new movie
});

// Close the movie modal
closeModalBtn.addEventListener('click', () => {
    movieModal.classList.add('hidden');
    resetForm();
});

// Add or edit a movie
movieForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = movieTitleInput.value;
    const genre = movieGenreInput.value;
    const status = movieStatusInput.value;
    const rating = movieRatingInput.value;

    if (title && genre && rating) {
        const movie = {
            title,
            genre,
            status,
            rating: parseInt(rating),  // Ensure rating is an integer
        };

        if (editingMovieId) {
            // Update the movie
            await updateMovieInBackend(editingMovieId, movie);
            const updatedMovie = { id: editingMovieId, ...movie };
            updateMovieInLibrary(updatedMovie);
        } else {
            // Add a new movie
            const addedMovie = await addMovieToBackend(movie);
            addMovieToLibrary(addedMovie);
        }

        movieModal.classList.add('hidden');
        resetForm();
    } else {
        alert('Please fill in all fields!');
    }
});

// Fetch existing movies from the backend on page load
async function fetchMovies() {
    try {
        const response = await fetch('http://localhost:3000/items');
        const movies = await response.json();
        movies.forEach(movie => addMovieToLibrary(movie));
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Call fetchMovies when the page loads
window.onload = fetchMovies;

// Add the movie to the backend
async function addMovieToBackend(movie) {
    try {
        const response = await fetch('http://localhost:3000/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movie),
        });
        const data = await response.json();
        return data;  // Return the movie data with its ID from the backend
    } catch (error) {
        console.error('Error adding movie:', error);
    }
}

// Update the movie in the backend
async function updateMovieInBackend(id, movie) {
    try {
        await fetch(`http://localhost:3000/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movie),
        });
    } catch (error) {
        console.error('Error updating movie:', error);
    }
}

// Add the movie to the library
// Add the movie to the library
function addMovieToLibrary(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'shadow', 'relative');

    const titleElement = document.createElement('h3');
    titleElement.classList.add('text-xl', 'font-bold');
    titleElement.textContent = movie.title;

    const genreElement = document.createElement('p');
    genreElement.classList.add('text-gray-400');
    genreElement.textContent = `Genre: ${movie.genre}`;

    const statusElement = document.createElement('p');
    statusElement.classList.add('text-gray-400');
    statusElement.textContent = `Status: ${movie.status}`;

    const ratingElement = document.createElement('p');
    ratingElement.classList.add('text-gray-400');
    ratingElement.textContent = `Rating: ${movie.rating}`;

    // Create Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('absolute', 'top-2', 'right-2', 'bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded'); // Corrected class name
    editButton.addEventListener('click', () => {
        movieTitleInput.value = movie.title;
        movieGenreInput.value = movie.genre;
        movieStatusInput.value = movie.status;
        movieRatingInput.value = movie.rating;
        editingMovieId = movie.id; // Set the ID of the movie being edited
        movieModal.classList.remove('hidden');
    });

    // Create Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('absolute', 'top-2', 'right-16', 'bg-red-500', 'text-white', 'px-2', 'py-1', 'rounded'); // Corrected class name
    deleteButton.addEventListener('click', async () => {
        const confirmed = confirm('Are you sure you want to delete this movie?');
        if (confirmed) {
            await deleteMovieFromBackend(movie.id);
            movieCard.remove(); // Remove the movie card from the library
        }
    });

    movieCard.appendChild(titleElement);
    movieCard.appendChild(genreElement);
    movieCard.appendChild(statusElement);
    movieCard.appendChild(ratingElement);
    movieCard.appendChild(editButton);
    movieCard.appendChild(deleteButton);
    library.appendChild(movieCard);
}

// Delete the movie from the backend
async function deleteMovieFromBackend(id) {
    try {
        await fetch(`http://localhost:3000/items/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
}

// Update the movie in the library
function updateMovieInLibrary(movie) {
    const movieCards = library.children;
    for (let card of movieCards) {
        const titleElement = card.querySelector('h3');
        if (titleElement.textContent === movie.title) {
            card.querySelector('p:nth-child(2)').textContent = `Genre: ${movie.genre}`;
            card.querySelector('p:nth-child(3)').textContent = `Status: ${movie.status}`;
            card.querySelector('p:nth-child(4)').textContent = `Rating: ${movie.rating}`;
            break;
        }
    }
}

// Reset the form fields
function resetForm() {
    movieTitleInput.value = '';
    movieGenreInput.value = '';
    movieStatusInput.value = 'unwatched'; // Reset to default
    movieRatingInput.value = '';
    editingMovieId = null; // Reset editing ID
}