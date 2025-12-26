import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MoviesAndShows() {
  const apiKey = "2f639fc5aadf6185f631334da254f6fa";
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setItems(data.results);
      })
      .catch((err) => console.error(err));
  }, [apiKey]);

  if (items.length === 0) return <div>Loading...</div>;

  return (
    <section className="movies container" id="movies">
      <div className="heading">
        <h2 className="heading-title">Movies & Shows</h2>
      </div>
      <div className="movies-content">
        {items.map((item) => (
          <div key={item.id} className="movie-box">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="movie-box-img"
            />
            <div className="box-text">
              <h2 className="movie-title">{item.title || item.name}</h2>
              <span className="movie-type">
                {item.media_type === "movie" ? "Movie" : "TV Show"}
              </span>
              <Link
                to={`/trailer/${item.id}? type=${item.media_type || "movie"}`}
                className="watch-btn play-btn"
              >
                <i className="bx bx-right-arrow"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
