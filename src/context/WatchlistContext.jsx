import { createContext, useContext } from "react";
import { useWatchlist } from "../hooks/useWatchlist";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const value = useWatchlist();
  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlistContext() {
  return useContext(WatchlistContext);
}
