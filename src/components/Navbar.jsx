import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const sections = [
      { id: "popular", hash: "#popular" },
      { id: "movies", hash: "#movies" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.id === entry.target.id);
            if (match) setActiveHash(match.hash);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    if (pathname !== "/") setActiveHash("");
    return () => observer.disconnect();
  }, [pathname]);

  const handleHashClick = (e, hash) => {
    if (pathname === "/") {
      e.preventDefault();
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setActiveHash(hash);
    }
  };

  const isHome = pathname === "/" && activeHash === "";
  const isWatchlist = pathname === "/watchlist";

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className={`nav-link ${isHome ? "nav-active" : ""}`} title="Home">
        <span className="nav-icon-wrap"><i className="bx bx-home"></i></span>
        <span className="nav-link-title">Home</span>
      </Link>
      <Link
        to="/#popular"
        className={`nav-link ${activeHash === "#popular" ? "nav-active" : ""}`}
        title="Trending"
        onClick={(e) => handleHashClick(e, "#popular")}
      >
        <span className="nav-icon-wrap"><i className="bx bxs-hot"></i></span>
        <span className="nav-link-title">Hot</span>
      </Link>
      <Link
        to="/#movies"
        className={`nav-link ${activeHash === "#movies" ? "nav-active" : ""}`}
        title="Explore"
        onClick={(e) => handleHashClick(e, "#movies")}
      >
        <span className="nav-icon-wrap"><i className="bx bx-compass"></i></span>
        <span className="nav-link-title">Explore</span>
      </Link>
      <div className="nav-divider" />
      <Link to="/watchlist" className={`nav-link ${isWatchlist ? "nav-active" : ""}`} title="My List">
        <span className="nav-icon-wrap"><i className="bx bx-bookmark"></i></span>
        <span className="nav-link-title">List</span>
      </Link>
    </nav>
  );
}
