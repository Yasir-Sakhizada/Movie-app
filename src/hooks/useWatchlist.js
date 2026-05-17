import { useState } from "react";

const KEY = "popcorn_watchlist";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(load);

  function toggle(item) {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === item.id);
      const next = exists ? prev.filter((m) => m.id !== item.id) : [...prev, item];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function isInList(id) {
    return watchlist.some((m) => m.id === id);
  }

  return { watchlist, toggle, isInList };
}
