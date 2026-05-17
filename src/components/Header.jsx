import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { useWatchlistContext } from "../context/WatchlistContext";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export default function Header() {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const { watchlist } = useWatchlistContext();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchUrl =
    debouncedQuery.trim().length > 1
      ? `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(debouncedQuery)}&include_adult=false`
      : null;

  const { data } = useFetch(searchUrl);
  const results = (data?.results || []).filter(
    (r) => r.media_type !== "person" && r.poster_path
  );
  const showResults = focused && query.trim().length > 1;

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="nav container">
        <Link to="/" className="logo">
          Pop<span>Corn</span>
        </Link>

        <div className="search-box" ref={searchRef}>
          <i className="bx bx-search"></i>
          <input
            type="search"
            id="search-input"
            placeholder="Search movies & shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            autoComplete="off"
          />
          {showResults && (
            <div className="search-results">
              {results.length === 0 ? (
                <div style={{ padding: "1rem", textAlign: "center", color: "var(--muted)", fontSize: "0.82rem" }}>
                  No results found
                </div>
              ) : (
                results.slice(0, 7).map((item) => (
                  <Link
                    key={item.id}
                    to={`/trailer/${item.id}?type=${item.media_type || "movie"}`}
                    onClick={() => { setQuery(""); setFocused(false); }}
                    className="search-result-item"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                    />
                    <div className="search-result-info">
                      <span className="search-result-title">{item.title || item.name}</span>
                      <span className="search-result-year">
                        {item.media_type === "tv" ? "TV · " : "Film · "}
                        {(item.release_date || item.first_air_date)?.slice(0, 4) || "—"}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        <Link to="/watchlist" className="watchlist-btn" title="My Watchlist">
          <i className="bx bx-bookmark"></i>
          {watchlist.length > 0 && (
            <span className="watchlist-badge">{watchlist.length}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
