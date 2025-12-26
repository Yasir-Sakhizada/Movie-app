import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const apiKey = "2f639fc5aadf6185f631334da254f6fa";

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results))
      .catch((err) => console.error(err));
  }, []);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <>
      <div className="heading">
        <h2 className="heading-title">Popular Movies</h2>

        <div className="swiper-btn">
          <div ref={prevRef} className="swiper-button-prev"></div>
          <div ref={nextRef} className="swiper-button-next"></div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          // Assign refs after Swiper initializes
          setTimeout(() => {
            if (prevRef.current && nextRef.current) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            }
          });
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={20}
        slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 1 }, // mobile (0px and up)
          640: { slidesPerView: 2 }, // tablets
          768: { slidesPerView: 3 }, // small desktops
          1024: { slidesPerView: 4 }, // large desktops
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="movie-box">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-box-img"
              />
              <div className="box-text">
                <h3 className="movie-title">{movie.title}</h3>
                <Link
                  to={`/trailer/${movie.id}?type=${
                    movie.media_type || "movie"
                  }`}
                  className="watch-btn play-btn"
                >
                  <i className="bx bx-right-arrow"></i>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
