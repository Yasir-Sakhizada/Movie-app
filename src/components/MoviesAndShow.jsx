import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFetch } from "../hooks/useFetch";
import { useWatchlistContext } from "../context/WatchlistContext";
import { SkeletonGrid } from "./Skeleton";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

const TABS = [
  { label: "All", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "TV Shows", value: "tv" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, delay: (i % 8) * 0.055, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function MoviesAndShows() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const loaderRef = useRef(null);
  const { toggle, isInList } = useWatchlistContext();

  const { data: movieGenreData } = useFetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
  const { data: tvGenreData } = useFetch(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
  );
  const { data, loading } = useFetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&page=${page}`
  );

  // Merge genres from both movie and TV
  useEffect(() => {
    const movieGenres = movieGenreData?.genres || [];
    const tvGenres = tvGenreData?.genres || [];
    const merged = [...movieGenres];
    tvGenres.forEach((g) => {
      if (!merged.find((m) => m.id === g.id)) merged.push(g);
    });
    merged.sort((a, b) => a.name.localeCompare(b.name));
    if (merged.length > 0) setGenres(merged);
  }, [movieGenreData, tvGenreData]);

  // Reset on filter change
  useEffect(() => {
    setAllItems([]);
    setPage(1);
  }, [activeTab, activeGenre]);

  // Append new results (deduplicated)
  useEffect(() => {
    if (data?.results) {
      setAllItems((prev) => {
        const ids = new Set(prev.map((i) => i.id));
        return [...prev, ...data.results.filter((i) => !ids.has(i.id))];
      });
    }
  }, [data]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !loading) setPage((p) => p + 1); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  let filtered = allItems;
  if (activeTab !== "all") filtered = filtered.filter((i) => i.media_type === activeTab);
  if (activeGenre) filtered = filtered.filter((i) => i.genre_ids?.includes(activeGenre));

  return (
    <section className="movies container" id="movies">
      <motion.div
        className="heading"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="heading-title">Movies &amp; Shows</h2>
      </motion.div>

      <motion.div
        className="filter-tabs"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`filter-tab ${activeTab === t.value ? "active" : ""}`}
            onClick={() => setActiveTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        className="genre-pills"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          className={`genre-pill ${activeGenre === null ? "active" : ""}`}
          onClick={() => setActiveGenre(null)}
        >
          All Genres
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            className={`genre-pill ${activeGenre === g.id ? "active" : ""}`}
            onClick={() => setActiveGenre(activeGenre === g.id ? null : g.id)}
          >
            {g.name}
          </button>
        ))}
      </motion.div>

      {filtered.length === 0 && loading ? (
        <SkeletonGrid count={8} />
      ) : filtered.length === 0 ? (
        <div className="no-results">
          <i className="bx bx-film"></i>
          <p>No results for this filter.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={activeTab + activeGenre} className="movies-content">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                className="movie-box"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : "https://placehold.co/300x450/111118/e63946?text=No+Image"
                  }
                  alt={item.title || item.name}
                  className="movie-box-img"
                  loading="lazy"
                />
                <div className="box-text">
                  <h2 className="movie-title">{item.title || item.name}</h2>
                  <span className="movie-type">
                    {item.media_type === "movie" ? "Movie" : "TV Show"}
                  </span>
                  {item.vote_average > 0 && (
                    <div className="movie-rating">
                      <i className="bx bxs-star"></i>
                      {item.vote_average?.toFixed(1)}
                    </div>
                  )}
                  <p className="movie-overview">{item.overview?.slice(0, 85)}...</p>
                  <div className="box-actions">
                    <Link
                      to={`/trailer/${item.id}?type=${item.media_type || "movie"}`}
                      className="watch-btn play-btn"
                    >
                      <i className="bx bx-right-arrow"></i>
                    </Link>
                    <button
                      className={`bookmark-sm ${isInList(item.id) ? "bookmarked" : ""}`}
                      onClick={() => toggle({
                        id: item.id,
                        title: item.title || item.name,
                        poster_path: item.poster_path,
                        vote_average: item.vote_average,
                        release_date: item.release_date || item.first_air_date,
                        media_type: item.media_type,
                      })}
                    >
                      <i className={`bx ${isInList(item.id) ? "bxs-bookmark" : "bx-bookmark"}`}></i>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <div ref={loaderRef} style={{ height: "60px", marginTop: "1rem" }}>
        {loading && allItems.length > 0 && (
          <div className="loading-more">
            <div className="loader-small"></div>
          </div>
        )}
      </div>
    </section>
  );
}
