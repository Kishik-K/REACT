import React, { useEffect, useState } from "react";
import Search from "./components/search";
import Spinner from "./components/spinner";
import MovieCard from "./components/movieCard";
import MovieModal from "./components/movieModal";
import { useDebounce } from "use-debounce";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const fetchMovies = async (query = "", page = 1) => {
    page === 1 ? setIsLoading(true) : setIsLoadingMore(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.response === "false") {
        setErrorMessage(data.error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList((prev) =>
        page === 1 ? data.results || [] : [...prev, ...(data.results || [])],
      );
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);

      if (query && page === 1 && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  const goHome = () => {
    setSearchTerm("");
    setSelectedMovieId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    fetchMovies(debouncedSearchTerm, currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <a
        href="/"
        className="site-logo"
        onClick={(e) => {
          e.preventDefault();
          goHome();
        }}
      >
        <img src="/logo.png" alt="Le Carnet" />
      </a>

      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find what you <span className="text-gradient">desire</span>
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && !searchTerm && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li
                  key={movie.$id}
                  onClick={() => setSelectedMovieId(movie.movie_id)}
                >
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2> All movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovieId(movie.id)}
                  />
                ))}
              </ul>

              {currentPage < totalPages && (
                <div className="load-more">
                  <button onClick={handleLoadMore} disabled={isLoadingMore}>
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <MovieModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
        onSelectMovie={setSelectedMovieId}
      />
    </main>
  );
}

export default App;
