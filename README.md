# Movie Watchlist

A web application for searching movies and saving them to a personal watchlist.

## Features

- Search for movies by title
- View movie details, including poster, rating, runtime, genre, and plot
- Add and remove movies from the watchlist
- Persist watchlist data using browser `localStorage`
- Light and dark theme support
- Automatically uses the system theme by default

## Technologies

- HTML5
- CSS3
- JavaScript (ES Modules)
- OMDb API
- Local Storage

## Project Structure

```text
Movie Watchlist/
├── index.html          # Movie search page
├── index.js            # Search, theme, and watchlist logic
├── watchlist.html      # Saved watchlist page
├── watchlist.js        # Watchlist rendering and management
├── index.css           # Application styles
└── icons/              # Interface icons
```

## Environment Variables

This project uses the OMDb API. Create a `.env` file in the project root by copying `.env.example`.

    VITE_OMDB_API_KEY=your_actual_omdb_api_key

Get an API key from [OMDb API](https://www.omdbapi.com/apikey.aspx).

> Do not commit the `.env` file because it contains your personal API key.

## How to Run

1. Open the project folder in Visual Studio Code.
2. Copy `.env.example` to `.env`.
3. Add your OMDb API key to `.env`.
4. Install dependencies:

   npm install

5. Start the Vite development server:

   npm run dev

## Usage

1. Enter a movie title in the search field.
2. Click **Search** or press **Enter**.
3. Click the plus button to add a movie to your watchlist.
4. Open **My Watchlist** to view or remove saved movies.

## Notes

Watchlist data and theme preferences are stored locally in the browser. Clearing browser site data will remove the saved watchlist and theme preference.
