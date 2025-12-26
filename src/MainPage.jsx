import Header from "./components/Header";
import Trailer from "./components/Trailer";
import PopularMovieContainer from "./components/PopularMovieContainer";
import Footer from "./components/footer";
import MoviesAndShow from "./components/MoviesAndShow";

function MainPage() {
  
  return (
    <div>
      <Header />
      <Trailer />
      <PopularMovieContainer />
      <MoviesAndShow />
      <Footer />
    </div>
  );
}

export default MainPage;
