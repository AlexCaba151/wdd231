// Import modules
import { getMovieById } from './data.js';
import { getFavorites, toggleFavorite, showLoading, hideLoading, createSVGIcon, formatDate } from './utils.js';

// Favorites page functionality
let favoriteMovies = [];

// DOM elements
const favoritesContent = document.getElementById("favorites-content");

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadFavoriteMovies();
});

// Load favorite movies
async function loadFavoriteMovies() {
  try {
    showLoading("loading-spinner");

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const favoriteIds = getFavorites();
    favoriteMovies = favoriteIds.map(id => getMovieById(parseInt(id))).filter(Boolean);

    hideLoading("loading-spinner");
    renderFavorites();
  } catch (error) {
    console.error("Error loading favorite movies:", error);
    hideLoading("loading-spinner");
    showError("Failed to load favorites. Please try again later.");
  }
}

// Render favorites
function renderFavorites() {
  if (!favoritesContent) return;

  if (favoriteMovies.length === 0) {
    renderNoFavorites();
    return;
  }

  favoritesContent.innerHTML = `
    <div class="favorites-controls">
      <h2>${favoriteMovies.length} Favorite Movie${favoriteMovies.length !== 1 ? "s" : ""}</h2>
      <button class="clear-all-btn" onclick="clearAllFavorites()">
        ${createSVGIcon("trash", 16).outerHTML}
        Clear All
      </button>
    </div>
    
    <div class="favorites-grid">
      ${favoriteMovies.map(movie => createFavoriteCard(movie)).join("")}
    </div>
  `;
}

// Render no favorites state
function renderNoFavorites() {
  favoritesContent.innerHTML = `
    <div class="no-favorites">
      ${createSVGIcon("heart", 80).outerHTML}
      <h2>No Favorites Yet</h2>
      <p>Start adding movies to your favorites by clicking the heart icon on any movie.</p>
      <a href="index.html" class="discover-movies-btn">Discover Movies</a>
    </div>
  `;
}

// Create favorite card
function createFavoriteCard(movie) {
  return `
    <div class="favorite-card">
      <img src="${movie.poster_path}" alt="${movie.title}" class="favorite-poster" loading="lazy">
      <div class="favorite-info">
        <h3 class="favorite-title">${movie.title}</h3>
        <div class="favorite-meta">
          <div class="rating">
            ${createSVGIcon("star", 16).outerHTML}
            <span>${movie.vote_average.toFixed(1)}</span>
          </div>
          <div class="year">
            ${createSVGIcon("calendar", 14).outerHTML}
            ${formatDate(movie.release_date)}
          </div>
        </div>
        <div class="runtime">
          ${createSVGIcon("clock", 14).outerHTML}
          ${movie.runtime} min
        </div>
        <p class="favorite-overview">${movie.overview}</p>
        <button class="remove-favorite-btn" onclick="removeFavorite(${movie.id})">
          ${createSVGIcon("heart", 14).outerHTML}
          Remove
        </button>
      </div>
    </div>
  `;
}

// Remove favorite
function removeFavorite(movieId) {
  toggleFavorite(movieId);
  favoriteMovies = favoriteMovies.filter(movie => movie.id !== movieId);
  renderFavorites();
}

// Clear all favorites
function clearAllFavorites() {
  if (confirm("Are you sure you want to remove all favorites?")) {
    localStorage.removeItem("movieFavorites");
    favoriteMovies = [];
    renderFavorites();
  }
}

// Show error message
function showError(message) {
  if (favoritesContent) {
    favoritesContent.innerHTML = `
      <div class="text-center" style="padding: 3rem;">
        <p style="color: #ef4444; margin-bottom: 1rem;">${message}</p>
        <button onclick="loadFavoriteMovies()" class="discover-movies-btn">
          Try Again
        </button>
      </div>
    `;
  }
}

// Export functions for global access
window.removeFavorite = removeFavorite;
window.clearAllFavorites = clearAllFavorites;