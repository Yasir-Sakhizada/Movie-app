import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Routes, Route,  HashRouter} from "react-router-dom";
import "./index.css";
import TrailerPage from "./components/TrailerPage.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/trailer/:id" element={<TrailerPage />} />
    </Routes>
  </HashRouter>
);
