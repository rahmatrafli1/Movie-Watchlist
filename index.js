const API_KEY = "bbd53fc"; // Ganti dengan API key dari https://www.omdbapi.com/apikey.aspx

// ===== Theme Management =====
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    applyTheme(saved);
  } else {
    // Gunakan sistem default, tanpa menyimpan ke localStorage
    applyTheme(getSystemTheme());
  }
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);

  // Update semua icon plus yang sedang tampil setelah theme berubah
  document
    .querySelectorAll(".watchlist-btn:not(.added) .btn-icon")
    .forEach((img) => {
      img.src = next === "dark" ? "icons/plus-dark.svg" : "icons/plus.svg";
    });
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");

      // Update icon saat sistem theme berubah
      document
        .querySelectorAll(".watchlist-btn:not(.added) .btn-icon")
        .forEach((img) => {
          img.src = e.matches ? "icons/plus-dark.svg" : "icons/plus.svg";
        });
    }
  });

initTheme();

// ===== DOM Elements =====
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieList = document.getElementById("movieList");
const defaultState = document.getElementById("defaultState");
const noResults = document.getElementById("noResultsState");
const loadingState = document.getElementById("loadingState");

// ===== State helpers =====
function showState(state) {
  defaultState.classList.add("hidden");
  noResults.classList.add("hidden");
  loadingState.classList.add("hidden");
  movieList.classList.add("hidden");

  if (state === "default") defaultState.classList.remove("hidden");
  if (state === "noResult") noResults.classList.remove("hidden");
  if (state === "loading") loadingState.classList.remove("hidden");
  if (state === "results") movieList.classList.remove("hidden");
}

// ===== Watchlist helpers =====
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist") || "[]");
}

function isInWatchlist(imdbID) {
  return getWatchlist().some((m) => m.imdbID === imdbID);
}

function toggleWatchlist(movie) {
  let list = getWatchlist();
  const idx = list.findIndex((m) => m.imdbID === movie.imdbID);
  if (idx === -1) {
    list.push(movie);
  } else {
    list.splice(idx, 1);
  }
  localStorage.setItem("watchlist", JSON.stringify(list));
}

function setupReadMore(plotEl) {
  const btn = plotEl.querySelector(".read-more-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const expanded = plotEl.dataset.expanded === "true";
    if (!expanded) {
      plotEl.innerHTML =
        decodeURIComponent(plotEl.dataset.full) +
        ` <button class="read-more-btn">Show less</button>`;
      plotEl.dataset.expanded = "true";
      plotEl.style.webkitLineClamp = "unset";
    } else {
      plotEl.innerHTML =
        decodeURIComponent(plotEl.dataset.short) +
        ` <button class="read-more-btn">Read more</button>`;
      plotEl.dataset.expanded = "false";
      plotEl.style.webkitLineClamp = "3";
    }
    setupReadMore(plotEl);
  });
}

function getPlusIcon() {
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "dark" ? "icons/plus-dark.svg" : "icons/plus.svg";
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const inList = isInWatchlist(movie.imdbID);
    const li = document.createElement("li");
    li.className = "movie-item";
    li.dataset.id = movie.imdbID;

    const posterHTML =
      movie.Poster && movie.Poster !== "N/A"
        ? `<img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster" loading="lazy">`
        : `<div class="poster-placeholder">🎬</div>`;

    const rating =
      movie.imdbRating && movie.imdbRating !== "N/A"
        ? `<span class="movie-rating"><span class="star-icon">⭐</span>${movie.imdbRating}</span>`
        : "";

    const runtime =
      movie.Runtime && movie.Runtime !== "N/A" ? movie.Runtime : "";
    const genre = movie.Genre && movie.Genre !== "N/A" ? movie.Genre : "";
    const meta = [runtime, genre].filter(Boolean).join(" &nbsp;");

    const plot = movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "";
    const isLong = plot.length > 120;
    const shortPlot = isLong ? plot.slice(0, 120) + "..." : plot;

    li.innerHTML = `
            ${posterHTML}
            <div class="movie-info">
                <div class="movie-header">
                    <span class="movie-title">${movie.Title}</span>
                    ${rating}
                </div>
                <div class="movie-meta meta-btn-row">
                    <span>${meta}</span>
                    <button class="watchlist-btn ${inList ? "added" : ""}" data-id="${movie.imdbID}">
                        ${
                          inList
                            ? `✅ Added`
                            : `<img src="${getPlusIcon()}" class="btn-icon" alt="add"> Watchlist`
                        }
                    </button>
                </div>
                ${
                  plot
                    ? `
                <p class="movie-plot" 
                    data-full="${encodeURIComponent(plot)}" 
                    data-short="${encodeURIComponent(shortPlot)}" 
                    data-expanded="false">
                    ${shortPlot}
                    ${isLong ? `<button class="read-more-btn">Read more</button>` : ""}
                </p>`
                    : ""
                }
            </div>
        `;

    // Watchlist button
    li.querySelector(".watchlist-btn").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const movieData = movies.find((m) => m.imdbID === btn.dataset.id);
      toggleWatchlist(movieData);
      const added = isInWatchlist(btn.dataset.id);
      btn.innerHTML = added
        ? `✅ Added`
        : `<img src="${getPlusIcon()}" class="btn-icon" alt="add"> Watchlist`;
      btn.classList.toggle("added", added);
    });

    // Read more
    const plotEl = li.querySelector(".movie-plot");
    if (plotEl) setupReadMore(plotEl);

    movieList.appendChild(li);
  });

  showState("results");
}

// ===== Search =====
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;

  showState("loading");

  try {
    // Search for multiple results
    const searchRes = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`,
    );
    const searchData = await searchRes.json();

    if (searchData.Response === "False" || !searchData.Search?.length) {
      showState("noResult");
      return;
    }

    // Fetch full details for each (up to 5)
    const detailPromises = searchData.Search.slice(0, 5).map((m) =>
      fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}&plot=full`,
      ).then((r) => r.json()),
    );

    const movies = await Promise.all(detailPromises);
    renderMovies(movies);
  } catch (err) {
    showState("noResult");
    console.error("Search error:", err);
  }
}

searchBtn.addEventListener("click", searchMovies);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMovies();
});
