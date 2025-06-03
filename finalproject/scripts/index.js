// Import modules
import { fetchMoviesData, getGenreNames } from "./data.js"
import { debounce } from "./utils.js"

// State management
let allMovies = []
let filteredMovies = []
let currentSearchTerm = ""

// DOM elements
const searchInput = document.getElementById("search-input")
const moviesGrid = document.getElementById("movies-grid")
const moviesHeading = document.getElementById("movies-heading")
const noResults = document.getElementById("no-results")
const movieModal = document.getElementById("movie-modal")

// Mock functions (replace with actual implementations)
function showLoading(elementId) {
  console.log(`Showing loading spinner: ${elementId}`)
}

function hideLoading(elementId) {
  console.log(`Hiding loading spinner: ${elementId}`)
}

function isFavorite(movieId) {
  // Replace with actual favorite check implementation
  return localStorage.getItem(`favorite-${movieId}`) === "true"
}

function toggleFavorite(movieId) {
  const isCurrentlyFavorite = isFavorite(movieId)
  if (isCurrentlyFavorite) {
    localStorage.removeItem(`favorite-${movieId}`)
    return false
  } else {
    localStorage.setItem(`favorite-${movieId}`, "true")
    return true
  }
}

function getMovieById(movieId) {
  return allMovies.find((movie) => movie.id === movieId)
}

function createSVGIcon(iconName, size) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", size)
  svg.setAttribute("height", size)
  svg.setAttribute("viewBox", "0 0 24 24")
  svg.setAttribute("fill", "none")
  svg.setAttribute("stroke", "currentColor")
  svg.setAttribute("stroke-width", "2")
  svg.setAttribute("stroke-linecap", "round")
  svg.setAttribute("stroke-linejoin", "round")

  let path = ""
  switch (iconName) {
    case "heart":
      path =
        "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      break
    case "star":
      path = "M12 2L14.09 8.26 22 9.27 16 14.54 17.91 21.73 12 18.2 6.09 21.73 7.91 14.54 2 9.27 9.91 8.26 12 2z"
      break
    case "calendar":
      path = "M3 4h18c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM21 8H3"
      break
    case "clock":
      path = "M12 6v6l4 2"
      break
    case "play":
      path = "M5 3l14 9-14 9V3z"
      break
    case "x":
      path = "M18 6L6 18M6 6l12 12"
      break
    case "dollar":
      path = "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"
      break
    default:
      break
  }

  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
  pathElement.setAttribute("d", path)
  svg.appendChild(pathElement)

  return svg
}

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  await loadMovies()
  setupSearch()
})

// Load movies using fetch API with try/catch
async function loadMovies() {
  try {
    showLoading("loading-spinner")

    // Fetch data from external source
    const moviesData = await fetchMoviesData()

    // Use array methods to process data
    allMovies = moviesData.map((movie) => ({
      ...movie,
      genres: getGenreNames(movie.genre_ids),
    }))

    filteredMovies = allMovies

    hideLoading("loading-spinner")
    renderMovies()
  } catch (error) {
    console.error("Error loading movies:", error)
    hideLoading("loading-spinner")
    showError("Failed to load movies. Please try again later.")
  }
}

// Setup search functionality
function setupSearch() {
  if (searchInput) {
    const debouncedSearch = debounce(handleSearch, 300)
    searchInput.addEventListener("input", debouncedSearch)
  }
}

// Use array filter method for search
function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase()
  currentSearchTerm = searchTerm

  if (searchTerm === "") {
    filteredMovies = allMovies
    moviesHeading.textContent = "Popular Movies"
    noResults.classList.add("hidden")
  } else {
    // Use array filter method
    filteredMovies = allMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.overview.toLowerCase().includes(searchTerm) ||
        movie.genres.some((genre) => genre.name.toLowerCase().includes(searchTerm)),
    )

    moviesHeading.textContent = `Search Results (${filteredMovies.length})`

    if (filteredMovies.length === 0) {
      document.getElementById("search-term").textContent = searchInput.value.trim()
      noResults.classList.remove("hidden")
    } else {
      noResults.classList.add("hidden")
    }
  }

  renderMovies()
}

// Render movies using template literals and forEach
function renderMovies() {
  if (!moviesGrid) return

  // Clear existing content
  moviesGrid.innerHTML = ""

  // Use forEach array method
  filteredMovies.forEach((movie) => {
    const movieCard = createMovieCard(movie)
    moviesGrid.appendChild(movieCard)
  })
}

// Create movie card using template literals
function createMovieCard(movie) {
  const card = document.createElement("div")
  card.className = "movie-card"

  const isFav = isFavorite(movie.id)

  // Use template literals for dynamic content
  card.innerHTML = `
    <div class="movie-poster-container">
      <img src="${movie.poster_path}" 
           alt="${movie.title}" 
           class="movie-poster" 
           loading="lazy"
           onerror="this.src='https://via.placeholder.com/400x600/1f2937/ffffff?text=No+Image'">
      <button class="favorite-btn ${isFav ? "favorited" : ""}" 
              onclick="handleToggleFavorite(${movie.id})"
              aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
        ${isFav ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>'}
      </button>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${movie.title}</h3>
      <div class="movie-meta">
        <div class="rating">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${movie.vote_average.toFixed(1)}</span>
        </div>
        <div class="year">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>
          ${new Date(movie.release_date).getFullYear()}
        </div>
      </div>
      <div class="runtime">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        ${movie.runtime} min
      </div>
      <p class="movie-overview">${movie.overview}</p>
      <button class="view-details-btn" onclick="openMovieModal(${movie.id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        View Details
      </button>
    </div>
  `

  return card
}

// Create heart icon
function createHeartIcon(filled = false) {
  const svg = createSVGIcon("heart", 20)
  if (filled) {
    svg.setAttribute("fill", "currentColor")
  }
  return svg.outerHTML
}

// Handle toggle favorite
function handleToggleFavorite(movieId) {
  const isNowFavorite = toggleFavorite(movieId)

  // Update the button appearance
  const favoriteBtn = document.querySelector(`button[onclick="handleToggleFavorite(${movieId})"]`)
  if (favoriteBtn) {
    if (isNowFavorite) {
      favoriteBtn.classList.add("favorited")
      favoriteBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>'
    } else {
      favoriteBtn.classList.remove("favorited")
      favoriteBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>'
    }
  }

  // Update modal if open
  updateModalFavoriteButton(movieId, isNowFavorite)
}

// Open movie modal
function openMovieModal(movieId) {
  const movie = getMovieById(movieId)
  if (!movie || !movieModal) return

  const isFav = isFavorite(movieId)

  movieModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <img src="${movie.backdrop_path}" alt="${movie.title}" class="modal-backdrop">
        <div class="modal-backdrop-overlay"></div>
        <button class="modal-close-btn" onclick="closeMovieModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg>
        </button>
        <div class="modal-title-overlay">
          <h2 class="modal-title">${movie.title}</h2>
          <div class="modal-meta">
            <div class="rating">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${movie.vote_average.toFixed(1)}</span>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>
              ${new Date(movie.release_date).getFullYear()}
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${movie.runtime} min
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-grid">
          <div>
            <img src="${movie.poster_path}" alt="${movie.title}" class="modal-poster">
            <button class="modal-favorite-btn ${isFav ? "favorited" : ""}" onclick="handleToggleFavorite(${movie.id})" id="modal-favorite-${movie.id}">
              ${isFav ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>'}
              ${isFav ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
          <div class="modal-details">
            <h3>Overview</h3>
            <p class="modal-overview">${movie.overview}</p>
            
            <div class="modal-info-grid">
              <div class="modal-info-section">
                <h4>Genres</h4>
                <div class="genre-tags">
                  ${movie.genres.map((genre) => `<span class="genre-tag">${genre.name}</span>`).join("")}
                </div>
              </div>
              <div class="modal-info-section">
                <h4>Languages</h4>
                <div class="language-tags">
                  ${movie.spoken_languages.map((lang) => `<span class="language-tag">${lang.name}</span>`).join("")}
                </div>
              </div>
            </div>
            
            <div class="modal-stats-grid">
              <div class="modal-stat-card">
                <div class="modal-stat-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <h4>Budget</h4>
                </div>
                <p class="modal-stat-value">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(movie.budget)}</p>
              </div>
              <div class="modal-stat-card">
                <div class="modal-stat-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <h4>Revenue</h4>
                </div>
                <p class="modal-stat-value">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(movie.revenue)}</p>
              </div>
            </div>
            
            ${
              movie.production_companies.length > 0
                ? `
              <div class="production-companies">
                <h4>Production Companies</h4>
                <div class="company-tags">
                  ${movie.production_companies.map((company) => `<span class="company-tag">${company}</span>`).join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `

  movieModal.style.display = "flex"
  document.body.style.overflow = "hidden"
}

// Close movie modal
function closeMovieModal() {
  if (movieModal) {
    movieModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Update modal favorite button
function updateModalFavoriteButton(movieId, isFavorite) {
  const modalBtn = document.getElementById(`modal-favorite-${movieId}`)
  if (modalBtn) {
    if (isFavorite) {
      modalBtn.classList.add("favorited")
      modalBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> Remove from Favorites`
    } else {
      modalBtn.classList.remove("favorited")
      modalBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> Add to Favorites`
    }
  }
}

// Show error message
function showError(message) {
  if (moviesGrid) {
    moviesGrid.innerHTML = `
      <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
        <p style="color: #ef4444; margin-bottom: 1rem;">${message}</p>
        <button onclick="loadMovies()" class="view-details-btn" style="width: auto;">
          Try Again
        </button>
      </div>
    `
  }
}

// Close modal when clicking outside
movieModal?.addEventListener("click", (e) => {
  if (e.target === movieModal) {
    closeMovieModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && movieModal?.style.display === "flex") {
    closeMovieModal()
  }
})

// Export functions for global access
window.handleToggleFavorite = handleToggleFavorite
window.openMovieModal = openMovieModal
window.closeMovieModal = closeMovieModal
