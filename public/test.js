document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const movieModal = document.getElementById("movie-modal");
    const deleteModal = document.getElementById("delete-modal");
    const form = document.getElementById("movie-form");
    const library = document.getElementById("library");
    const addBtnMovie = document.getElementById("addBtnMovie");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const closeEditModalBtn = document.getElementById("close-edit-modal-btn");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const editModal = document.getElementById("edit-modal"); 
    const editForm = document.getElementById("edit-form"); 
    const editNameInput = document.getElementById("edit-movie-name"); 
    const editDescriptionInput = document.getElementById("edit-movie-description");
  
    let movieToDelete = null;
    let movieToEdit = null;
  
    // Show modals
    addBtnMovie.addEventListener("click", () => {
      movieModal.classList.remove("hidden");
    });
  
    const showDeleteModal = (movieId) => {
      movieToDelete = movieId;
      deleteModal.classList.remove("hidden");
    };
  
    const showEditModal = (movie) => {
      movieToEdit = movie;
      editNameInput.value = movie.name;
      editDescriptionInput.value = movie.description;
      editModal.classList.remove("hidden");
    };
  
    // Hide modals
    const hideModals = () => {
      movieModal.classList.add("hidden");
      deleteModal.classList.add("hidden");
      editModal.classList.add("hidden");
      movieToDelete = null;
      movieToEdit = null; 
    };
  
    closeModalBtn.addEventListener("click", hideModals);
    cancelDeleteBtn.addEventListener("click", hideModals);
    closeEditModalBtn.addEventListener("click", hideModals); 
  
    // Fetch movies from backend
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:3000/items");
        if (!response.ok) throw new Error("Failed to fetch movies");
  
        const data = await response.json();
        console.log(data);
  
        // Check if the 'items' property is an array
        if (!Array.isArray(data.items)) {
          console.error("Expected an array of movies in 'items', but got:", data.items);
          return;
        }
  
        displayMovies(data.items); 
      } catch (error) {
        console.error("Error fetching movies:", error);

      }
    };
  
    // Display movies in the library
    const displayMovies = (movies) => {
      library.innerHTML = "";
  
      movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.className = "bg-gray-800 text-white p-6 rounded shadow-md";
  
        movieCard.innerHTML = `
          <div>
            <h3 class="text-2xl font-bold text-center text-red-50">${movie.name}</h3>
            <p class="text-gray-400 mt-2 text-center italic">${movie.description}</p>
          </div>
          <div class="flex justify-end mt-4">
            <button data-id="${movie.id}" class="edit-btn px-4 py-2 bg-blue-500 rounded shadow hover:bg-blue-300">Edit</button>
            <button data-id="${movie.id}" class="delete-btn px-4 py-2 bg-red-500 rounded shadow hover:bg-red-300 ml-2">Delete</button>
          </div>
        `;
  
        movieCard.querySelector(".delete-btn").addEventListener("click", () => showDeleteModal(movie.id));
  
        movieCard.querySelector(".edit-btn").addEventListener("click", () => showEditModal(movie));
  
        library.appendChild(movieCard);
      });
    };
  
    // Handle form submission for adding a new movie
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const name = document.getElementById("movie-name").value.trim();
      const description = document.getElementById("movie-description").value.trim();
  
      if (!name || !description) {
        alert("Name and description are required fields.");
        return;
      }
  
      const newMovie = {
        name,
        description,
      };
  
      try {
        const response = await fetch("http://localhost:3000/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMovie),
        });
  
        if (!response.ok) throw new Error("Failed to save movie");
  
        fetchMovies();
        hideModals();
        form.reset(); 
      } catch (error) {
        console.error("Error saving movie:", error);
      }
    });
  
    // Handle form submission for editing an existing movie
    editForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const updatedName = editNameInput.value.trim();
      const updatedDescription = editDescriptionInput.value.trim();
  
      if (!updatedName || !updatedDescription) {
        alert("Name and description are required fields.");
        return;
      }
  
      const updatedMovie = {
        name: updatedName,
        description: updatedDescription,
      };
  
      try {
        const response = await fetch(`http://localhost:3000/items/${movieToEdit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMovie),
        });
  
        if (!response.ok) throw new Error("Failed to update movie");
  
        fetchMovies(); 
        hideModals(); 
      } catch (error) {
        console.error("Error updating movie:", error);
      }
    });
  
    // Handle delete confirmation
    confirmDeleteBtn.addEventListener("click", async () => {
      if (!movieToDelete) return;
  
      try {
        const response = await fetch(`http://localhost:3000/items/${movieToDelete}`, {
          method: "DELETE",
        });
  
        if (!response.ok) throw new Error("Failed to delete movie");
  
        fetchMovies(); 
        hideModals(); 
      } catch (error) {
        console.error("Error deleting movie:", error);
       
      }
    });
  
    // Initial fetch to load movies
    fetchMovies();
  });
  