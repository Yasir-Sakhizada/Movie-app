import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const apiKey = "2f639fc5aadf6185f631334da254f6fa";

  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${value}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header>
      <div className="nav container">
        <Link to="/" className="logo">
          Movie<span>Vel</span>
        </Link>

        {/* SEARCH BOX */}
        <div className="search-box" style={{ position: "relative" }}>
          <input
            type="search"
            id="search-input"
            placeholder="Search movie"
            value={query}
            onChange={handleSearch}
          />
          <i className="bx bx-search"></i>

          {/* SEARCH RESULTS DROPDOWN */}
          {results.length > 0 && (
            <div className="search-results">
              {results.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/trailer/${movie.id}?type=movie`}
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    borderBottom: "1px solid #222",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : "https://via.placeholder.com/50x75?text=?"
                    }
                    alt={movie.title}
                    style={{
                      width: "40px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "3px",
                    }}
                  />
                  <span>{movie.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="#" className="user">
          <img src="img/user.jpg" alt="" className="user-img" />
        </Link>

        <Navbar />
      </div>
    </header>
  );
}

export default Header;
