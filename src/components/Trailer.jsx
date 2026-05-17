import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFetch } from "../hooks/useFetch";
import { useWatchlistContext } from "../context/WatchlistContext";
import { SkeletonHero } from "./Skeleton";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function StarRating({ score }) {
  const filled = Math.round(score / 2);
  return (
    <span className="hero-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`bx ${i < filled ? "bxs-star" : "bx-star"}`}></i>
      ))}
    </span>
  );
}

export default function Trailer() {
  const { data, loading } = useFetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { toggle, isInList } = useWatchlistContext();
  const movies = data?.results?.slice(0, 8) || [];
  const movie = movies[index];

  useEffect(() => {
    if (movies.length === 0 || paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [movies.length, paused]);

  if (loading) return <SkeletonHero />;
  if (!movie) return null;

  const watchlistItem = {
    id: movie.id, title: movie.title,
    poster_path: movie.poster_path, vote_average: movie.vote_average,
    release_date: movie.release_date, media_type: "movie",
  };

  const year = movie.release_date?.slice(0, 4);
  const voteCount = movie.vote_count > 1000
    ? `${(movie.vote_count / 1000).toFixed(1)}k`
    : movie.vote_count;

  return (
    <section
      className="home container"
      id="home"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={movie.id + "-img"}
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          className="home-img"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id + "-text"}
          className="home-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">
            <i className="bx bxs-hot"></i>
            Trending Now
          </div>

          <h1 className="home-title">{movie.title}</h1>

          <div className="hero-rating">
            <StarRating score={movie.vote_average} />
            <span className="hero-score">{movie.vote_average?.toFixed(1)}</span>
            <span className="hero-votes">({voteCount} ratings)</span>
          </div>

          <p className="hero-overview">{movie.overview?.slice(0, 140)}...</p>

          <div className="hero-meta">
            {year && (
              <span><i className="bx bx-calendar"></i> {year}</span>
            )}
            <span><i className="bx bx-film"></i> Movie</span>
            <span><i className="bx bx-globe"></i> English</span>
          </div>

          <div className="hero-actions">
            <Link to={`/trailer/${movie.id}?type=movie`} className="watch-btn">
              <i className="bx bx-right-arrow"></i>
              Watch Trailer
            </Link>
            <button
              className={`bookmark-btn ${isInList(movie.id) ? "bookmarked" : ""}`}
              onClick={() => toggle(watchlistItem)}
            >
              <i className={`bx ${isInList(movie.id) ? "bxs-bookmark" : "bx-bookmark"}`}></i>
              {isInList(movie.id) ? "Saved" : "Save"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="hero-dots">
        {movies.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === index ? "active" : ""}`}
            onClick={() => { setIndex(i); setPaused(true); }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
