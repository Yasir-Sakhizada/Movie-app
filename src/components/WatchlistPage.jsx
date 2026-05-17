import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWatchlistContext } from "../context/WatchlistContext";

export default function WatchlistPage() {
  const { watchlist, toggle } = useWatchlistContext();

  return (
    <section className="movies container">
      <div className="watchlist-header">
        <div>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginBottom: "8px" }}>
            My Collection
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1, letterSpacing: "0.03em" }}>
            Watchlist
          </h1>
        </div>
        <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          {watchlist.length} {watchlist.length === 1 ? "title" : "titles"}
        </span>
        <div className="watchlist-big-count">{String(watchlist.length).padStart(2, "0")}</div>
      </div>

      {watchlist.length === 0 ? (
        <motion.div
          className="no-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <i className="bx bx-bookmark"></i>
          <p>Your watchlist is empty.</p>
          <Link to="/" className="watch-btn" style={{ display: "inline-flex", marginTop: "0.5rem" }}>
            <i className="bx bx-compass"></i>
            Browse Movies
          </Link>
        </motion.div>
      ) : (
        <div className="movies-content">
          {watchlist.map((item, i) => (
            <motion.div
              key={item.id}
              className="movie-box"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://placehold.co/300x450/111118/e63946?text=No+Image"
                }
                alt={item.title}
                className="movie-box-img"
              />
              <div className="box-text">
                <h2 className="movie-title">{item.title}</h2>
                <span className="movie-type">
                  {item.media_type === "movie" ? "Movie" : "TV Show"}
                </span>
                {item.vote_average > 0 && (
                  <div className="movie-rating">
                    <i className="bx bxs-star"></i>
                    {item.vote_average?.toFixed(1)}
                  </div>
                )}
                <div className="box-actions">
                  <Link
                    to={`/trailer/${item.id}?type=${item.media_type || "movie"}`}
                    className="watch-btn play-btn"
                  >
                    <i className="bx bx-right-arrow"></i>
                  </Link>
                  <button
                    className="bookmark-sm bookmarked"
                    onClick={() => toggle(item)}
                    title="Remove from watchlist"
                  >
                    <i className="bx bxs-bookmark"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
