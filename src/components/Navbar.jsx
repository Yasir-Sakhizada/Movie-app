import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/" className="nav-link nav-active">
        <i className="bx bx-home"></i>
        <span className="nav-link-title">Home</span>
      </Link>
      <Link to="#popular" className="nav-link">
        <i className="bx bxs-hot"></i>
        <span className="nav-link-title">Trending</span>
      </Link>
      <Link to="#movies" className="nav-link">
        <i className="bx bx-compass"></i>
        <span className="nav-link-title">Explore</span>
      </Link>
    </div>
  );
}

export default Navbar;
