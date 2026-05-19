import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useWatchlistContext } from "../context/WatchlistContext";

const SERVERS = [
  { name: "Server 1", movie: (id) => `https://vidsrc.to/embed/movie/${id}`, tv: (id) => `https://vidsrc.to/embed/tv/${id}` },
  { name: "Server 2", movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`, tv: (id) => `https://vidsrc.me/embed/tv?tmdb=${id}` },
  { name: "Server 3", movie: (id) => `https://superembed.stream/embed/tmdb/movie/${id}`, tv: (id) => `https://superembed.stream/embed/tmdb/tv/${id}` },
];

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export default function TrailerPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "movie";
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeServer, setActiveServer] = useState(0);
  const { toggle, isInList } = useWatchlistContext();

  useEffect(() => {
    setLoading(true);
    setShowVideo(false);
    setShowPlayer(false);
    setActiveServer(0);
    window.scrollTo({ top: 0, behavior: "instant" });

    const base = `https://api.themoviedb.org/3/${type}/${id}`;
    const lang = `?api_key=${API_KEY}&language=en-US`;

    Promise.all([
      fetch(`${base}${lang}`).then((r) => r.json()),
      fetch(`${base}/videos${lang}`).then((r) => r.json()),
      fetch(`${base}/credits${lang}`).then((r) => r.json()),
      fetch(`${base}/similar${lang}`).then((r) => r.json()),
    ])
      .then(([movieData, videosData, creditsData, similarData]) => {
        setMovie(movieData);
        // Prefer official trailer, fallback to any YouTube video
        const trailer =
          videosData.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videosData.results?.find((v) => v.site === "YouTube");
        setVideoKey(trailer?.key || null);
        setCast(creditsData.cast?.slice(0, 10) || []);
        setSimilar(
          (similarData.results || []).filter((i) => i.poster_path).slice(0, 8)
        );
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id, type]);

  // Trap ESC key for video overlay
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowVideo(false); };
    if (showVideo) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showVideo]);

  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
      <span>Loading</span>
    </div>
  );
  if (!movie) return (
    <div className="error-screen" style={{ marginTop: "8rem" }}>
      <i className="bx bx-error" style={{ fontSize: "3rem", color: "var(--red)", display: "block", marginBottom: "1rem" }}></i>
      <p>Could not load this title.</p>
      <Link to="/" style={{ color: "var(--red)", marginTop: "1rem", display: "inline-block" }}>← Back home</Link>
    </div>
  );

  const title = movie.title || movie.name;
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const year = (movie.release_date || movie.first_air_date)?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);
  const watchlistItem = { id: movie.id, title, poster_path: movie.poster_path, vote_average: movie.vote_average, release_date: movie.release_date || movie.first_air_date, media_type: type };

  return (
    <>
      {/* Hero */}
      <motion.div
        className="play-container container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          alt={title}
          className="play-img"
        />
        <motion.div
          className="play-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <h2>{title}</h2>
          <div className="movie-meta">
            {year && <span className="meta-tag">{year}</span>}
            {runtime && <span className="meta-tag">{runtime}</span>}
            {rating && (
              <span className="meta-tag rating-tag">
                <i className="bx bxs-star"></i> {rating}
              </span>
            )}
          </div>
          <div className="tags">
            {movie.genres?.map((g) => <span key={g.id}>{g.name}</span>)}
          </div>
          <div className="hero-actions">
            <button className="watch-btn" onClick={() => { setShowPlayer(true); setTimeout(() => document.getElementById("player-section")?.scrollIntoView({ behavior: "smooth" }), 100); }}>
              <i className="bx bx-play-circle"></i>
              Watch Now
            </button>
            {videoKey && (
              <button className="bookmark-btn" onClick={() => setShowVideo(true)}>
                <i className="bx bx-film"></i>
                Trailer
              </button>
            )}
            <button
              className={`bookmark-btn ${isInList(movie.id) ? "bookmarked" : ""}`}
              onClick={() => toggle(watchlistItem)}
            >
              <i className={`bx ${isInList(movie.id) ? "bxs-bookmark" : "bx-bookmark"}`}></i>
              {isInList(movie.id) ? "Saved" : "Save"}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Overlay */}
      {showVideo && videoKey && (
        <motion.div
          className="video-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            className="video-box"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-video" onClick={() => setShowVideo(false)}>
              <i className="bx bx-x"></i> Close
            </button>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>
      )}

      {/* ── Full Movie Player ── */}
      {showPlayer && (
        <motion.div
          id="player-section"
          className="about-movie container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", letterSpacing: "0.05em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-block", width: "3px", height: "1.2em", background: "var(--red)", borderRadius: "2px", boxShadow: "0 0 10px var(--red-glow)", flexShrink: 0 }}></span>
            Watch {title}
          </h2>

          {/* Server switcher */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
            {SERVERS.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveServer(i)}
                style={{
                  padding: "7px 18px",
                  borderRadius: "3px",
                  border: `1px solid ${activeServer === i ? "var(--red)" : "var(--border)"}`,
                  background: activeServer === i ? "var(--red)" : "transparent",
                  color: activeServer === i ? "#fff" : "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: activeServer === i ? "0 4px 16px var(--red-glow)" : "none",
                }}
              >
                {s.name}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--muted)", alignSelf: "center" }}>
              If one server fails, try another
            </span>
          </div>

          {/* Player iframe */}
          <div style={{
            position: "relative",
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#000",
            border: "1px solid var(--border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}>
            <iframe
              key={`${activeServer}-${id}`}
              src={type === "movie"
                ? SERVERS[activeServer].movie(id)
                : SERVERS[activeServer].tv(id)}
              style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block" }}
              allowFullScreen
              allow="autoplay; fullscreen"
              title={`Watch ${title}`}
            />
          </div>

          <p style={{ marginTop: "10px", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center" }}>
            Streams are provided by third-party sources. If a stream doesn't load, switch servers.
          </p>
        </motion.div>
      )}
      {movie.overview && (
        <motion.div
          className="about-movie container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>About</h2>
          <p>{movie.overview}</p>
        </motion.div>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <div className="about-movie container">
          <h2 className="cast-heading">Cast</h2>
          <div className="cast">
            {cast.map((member, i) => (
              <motion.div
                key={member.id}
                className="cast-box"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <img
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                      : "https://placehold.co/110x165/111118/e63946?text=?"
                  }
                  alt={member.name}
                  className="cast-img"
                />
                <span className="cast-title">{member.name}</span>
                <span className="cast-character">{member.character}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div className="about-movie container">
          <h2 className="cast-heading">More Like This</h2>
          <div className="similar-grid">
            {similar.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.93 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/trailer/${item.id}?type=${type}`} className="similar-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title || item.name}
                  />
                  <span>{item.title || item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
