import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useFetch } from "../hooks/useFetch";
import { useWatchlistContext } from "../context/WatchlistContext";
import { SkeletonGrid } from "./Skeleton";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export default function PopularMovies() {
  const { data, loading } = useFetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
  const { toggle, isInList } = useWatchlistContext();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const movies = data?.results || [];

  return (
    <>
      <motion.div
        className="heading"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="heading-title">Popular Movies</h2>
        <div className="swiper-btn">
          <div ref={prevRef} className="swiper-button-prev"></div>
          <div ref={nextRef} className="swiper-button-next"></div>
        </div>
      </motion.div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {movies.map((movie, i) => (
            <SwiperSlide key={movie.id}>
              <motion.div
                className="movie-box"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-box-img"
                  loading="lazy"
                />
                <div className="box-text">
                  <h3 className="movie-title">{movie.title}</h3>
                  {movie.vote_average > 0 && (
                    <div className="movie-rating">
                      <i className="bx bxs-star"></i>
                      {movie.vote_average?.toFixed(1)}
                    </div>
                  )}
                  <div className="box-actions">
                    <Link to={`/trailer/${movie.id}?type=movie`} className="watch-btn play-btn">
                      <i className="bx bx-right-arrow"></i>
                    </Link>
                    <button
                      className={`bookmark-sm ${isInList(movie.id) ? "bookmarked" : ""}`}
                      onClick={() => toggle({
                        id: movie.id, title: movie.title,
                        poster_path: movie.poster_path, vote_average: movie.vote_average,
                        release_date: movie.release_date, media_type: "movie",
                      })}
                    >
                      <i className={`bx ${isInList(movie.id) ? "bxs-bookmark" : "bx-bookmark"}`}></i>
                    </button>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}
