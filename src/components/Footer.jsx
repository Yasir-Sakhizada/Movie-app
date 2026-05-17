import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-inner container">
        <Link to="/" className="logo">Pop<span>Corn</span></Link>
        <p className="footer-tagline">Cinema lives in the dark.</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/#popular">Trending</Link>
          <Link to="/#movies">Explore</Link>
          <Link to="/watchlist">My List</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} PopCorn · Powered by TMDB</p>
      </div>
    </motion.footer>
  );
}
