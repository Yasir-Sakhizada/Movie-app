import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Trailer() {
  const apiKey = "2f639fc5aadf6185f631334da254f6fa";
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setMovie(data.results[0]); // take only the first movie
        }
      })
      .catch((err) => console.error(err));
  }, [apiKey]);

  // Guard clause: don't render until movie is loaded
  if (!movie) return <div>Loading...</div>;

  return (
    <section className="home container" id="home">
      <img
        alt={movie.title}
        src={`https://image.tmdb.org/t/p/w780${
          movie.backdrop_path || movie.poster_path
        }`}
        className="home-img"
      />
      <div className="home-text">
        <h1 className="home-title">{movie.title}</h1>
        <p>Release: {movie.release_date}</p>
        <Link
          to={`/trailer/${movie.id}?type=${movie.media_type || "movie"}`}
          className="watch-btn"
        >
          <i className="bx bx-right-arrow"></i>
          <span>Watch Trailer</span>
        </Link>
      </div>
    </section>
  );
}

export default Trailer;
