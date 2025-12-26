import PopularMovies from "./PopularMovie";

function PopularMovieContainer() {
  return (
    <section className="popular container" id="popular">
      <div className="popular-content">
        <PopularMovies />
      </div>
    </section>
  );
}

export default PopularMovieContainer;
