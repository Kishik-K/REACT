import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const GENRE_COLORS = [
  {
    bg: "rgba(59,130,246,0.15)",
    text: "#7bb0f7",
    border: "rgba(59,130,246,0.3)",
  },
  {
    bg: "rgba(34,197,94,0.15)",
    text: "#6fd18f",
    border: "rgba(34,197,94,0.3)",
  },
  {
    bg: "rgba(217,119,6,0.15)",
    text: "#e0a659",
    border: "rgba(217,119,6,0.3)",
  },
  {
    bg: "rgba(184,68,60,0.15)",
    text: "#d98e88",
    border: "rgba(184,68,60,0.3)",
  },
  {
    bg: "rgba(168,85,247,0.15)",
    text: "#c299f7",
    border: "rgba(168,85,247,0.3)",
  },
];

function MovieModal({ movieId, onClose, onSelectMovie }) {
  const [details, setDetails] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    document.body.style.overflow = "hidden";

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const [detailsRes, similarRes] = await Promise.all([
          fetch(`${API_BASE_URL}/movie/${movieId}`, API_OPTIONS),
          fetch(`${API_BASE_URL}/movie/${movieId}/similar`, API_OPTIONS),
        ]);
        setDetails(await detailsRes.json());
        const similarData = await similarRes.json();
        setSimilar((similarData.results || []).slice(0, 5));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    return () => {
      document.body.style.overflow = "";
    };
  }, [movieId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!movieId) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {isLoading || !details ? (
          <div className="modal-loading">Loading...</div>
        ) : (
          <>
            <div
              className="modal-backdrop"
              style={{
                backgroundImage: details.backdrop_path
                  ? `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`
                  : "none",
              }}
            />
            <div className="modal-content">
              <img
                className="modal-poster"
                src={
                  details.poster_path
                    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                    : "/no-movie.png"
                }
                alt={details.title}
              />
              <div className="modal-info">
                <h3>{details.title}</h3>
                <div className="modal-meta">
                  <span>{details.release_date?.slice(0, 4)}</span>
                  <span className="dot">·</span>
                  <span>{details.runtime} min</span>
                </div>
                <div className="modal-genres">
                  {details.genres?.map((genre, i) => {
                    const color = GENRE_COLORS[i % GENRE_COLORS.length];
                    return (
                      <span
                        key={genre.id}
                        className="genre-pill"
                        style={{
                          background: color.bg,
                          color: color.text,
                          borderColor: color.border,
                        }}
                      >
                        {genre.name}
                      </span>
                    );
                  })}
                </div>
                <p className="modal-overview">{details.overview}</p>
              </div>
            </div>

            {similar.length > 0 && (
              <div className="modal-similar">
                <h4>More Like This</h4>
                <ul>
                  {similar.map((movie) => (
                    <li key={movie.id} onClick={() => onSelectMovie(movie.id)}>
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : "/no-movie.png"
                        }
                        alt={movie.title}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MovieModal;
