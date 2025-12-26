import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";

export default function TrailerPage() {
  const { id } = useParams();
  const apiKey = "2f639fc5aadf6185f631334da254f6fa";

  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const fetchMovie = fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
    ).then((res) => res.json());

    const fetchVideos = fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
    ).then((res) => res.json());

    const fetchCredits = fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`
    ).then((res) => res.json());

    Promise.all([fetchMovie, fetchVideos, fetchCredits])
      .then(([movieData, videosData, creditsData]) => {
        setMovie(movieData);

        const trailer = videosData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        if (trailer) {
          setVideoKey(trailer.key);
        } else {
          setVideoKey(null);
          setError(true);
        }

        const castList = creditsData.cast?.slice(0, 6) || [];
        setCast(castList);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#111",
          flexDirection: "column",
        }}
      >
        <div className="loader"></div>
        <span style={{ color: "#fff", fontSize: "2rem", marginTop: "20px" }}>
          Loading...
        </span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div
        className="error-screen"
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "white",
          fontSize: "1.5rem",
        }}
      >
        Trailer not available for this movie.
      </div>
    );
  }

  return (
    <>
      <Header />
      {/* Play Container */}
      <div className="play-container container">
        <img
          src={`https://image.tmdb.org/t/p/original${
            movie.backdrop_path || movie.poster_path
          }`}
          alt={movie.title}
          className="play-img"
        />
        <div className="play-text">
          <h2>{movie.title}</h2>

          <div className="rating">
            {Array.from(
              { length: Math.floor(movie.vote_average / 2) },
              (_, i) => (
                <i key={i} className="bx bxs-star"></i>
              )
            )}
            {movie.vote_average % 2 >= 1 && (
              <i className="bx bxs-star-half"></i>
            )}
          </div>

          <div className="tags">
            {movie.genres?.map((g) => (
              <span key={g.id}>{g.name}</span>
            ))}
          </div>

          {videoKey && (
            <Link className="watch-btn" onClick={() => setShowVideo(true)}>
              <i className="bx bx-right-arrow"></i>
              <span>Watch the trailer</span>
            </Link>
          )}
        </div>
      </div>

      {/* Video Overlay */}
      {showVideo && (
        <div
          className="video-container"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="video-box"
            style={{ position: "relative", width: "80%" }}
          >
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: "block" }}
            ></iframe>
            <i
              className="bx bx-x close-video"
              onClick={() => setShowVideo(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                fontSize: "2rem",
                color: "#fff",
                cursor: "pointer",
              }}
            ></i>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="about-movie container">
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>

        {/* Cast Section */}
        <h2 className="cast-heading">Movie Cast</h2>
        <div className="cast">
          {cast.map((member) => (
            <div key={member.id} className="cast-box">
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                    : "img/user.jpg"
                }
                alt={member.name}
                className="cast-img"
              />
              <span className="cast-title">{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download Section */}
      <div className="download container">
        <h2 className="download-title">Download Movie</h2>
        <div className="download-links">
          <a
            href={`https://www.themoviedb.org/movie/${id}/watch?download=480p`}
            download
          >
            480p
          </a>
          <a
            href={`https://www.themoviedb.org/movie/${id}/watch?download=720p`}
            download
          >
            720p
          </a>
          <a
            href={`https://www.themoviedb.org/movie/${id}/watch?download=1080p`}
            download
          >
            1080p
          </a>
        </div>
      </div>
    </>
  );
}
