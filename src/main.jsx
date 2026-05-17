import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout.jsx";
import MainPage from "./MainPage.jsx";
import TrailerPage from "./components/TrailerPage.jsx";
import WatchlistPage from "./components/WatchlistPage.jsx";
import { WatchlistProvider } from "./context/WatchlistContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WatchlistProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/trailer/:id" element={<TrailerPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </Layout>
    </WatchlistProvider>
  </BrowserRouter>
);
