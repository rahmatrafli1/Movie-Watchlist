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
  applyTheme(saved || getSystemTheme());
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

initTheme();

// ===== DOM =====
const emptyWatchlist = document.getElementById("emptyWatchlist");
const watchlistContainer = document.getElementById("watchlistContainer");

// ===== Watchlist helpers =====
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist") || "[]");
}

function saveWatchlist(list) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

function removeFromWatchlist(imdbID) {
  const list = getWatchlist().filter((m) => m.imdbID !== imdbID);
  saveWatchlist(list);
}

// ===== Render =====
function renderWatchlist() {
  const list = getWatchlist();
  watchlistContainer.innerHTML = "";

  if (!list.length) {
    emptyWatchlist.classList.remove("hidden");
    watchlistContainer.classList.add("hidden");
    return;
  }

  emptyWatchlist.classList.add("hidden");
  watchlistContainer.classList.remove("hidden");

  list.forEach((movie) => {
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
                    <button class="remove-btn" data-id="${movie.imdbID}">➖ Remove</button>
                </div>
                ${
                  plot
                    ? `
                <p class="movie-plot" data-full="${encodeURIComponent(plot)}" data-short="${encodeURIComponent(shortPlot)}" data-expanded="false">
                    ${shortPlot}
                    ${isLong ? `<button class="read-more-btn">Read more</button>` : ""}
                </p>`
                    : ""
                }
            </div>
        `;

    // Remove button
    li.querySelector(".remove-btn").addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      removeFromWatchlist(id);
      li.style.animation = "fadeIn 0.3s ease reverse";
      setTimeout(() => renderWatchlist(), 280);
    });

    // Read more
    const plotEl = li.querySelector(".movie-plot");
    if (plotEl) {
      const readBtn = plotEl.querySelector(".read-more-btn");
      if (readBtn) {
        readBtn.addEventListener("click", function handler() {
          const expanded = plotEl.dataset.expanded === "true";
          if (!expanded) {
            plotEl.innerHTML =
              decodeURIComponent(plotEl.dataset.full) +
              ` <button class="read-more-btn">Show less</button>`;
            plotEl.dataset.expanded = "true";
            plotEl.style.webkitLineClamp = "unset";
          } else {
            const short = decodeURIComponent(plotEl.dataset.short);
            plotEl.innerHTML =
              short + ` <button class="read-more-btn">Read more</button>`;
            plotEl.dataset.expanded = "false";
            plotEl.style.webkitLineClamp = "3";
          }
          plotEl
            .querySelector(".read-more-btn")
            .addEventListener("click", handler);
        });
      }
    }

    watchlistContainer.appendChild(li);
  });
}

renderWatchlist();
