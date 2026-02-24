import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "favoriteBlogs";
const FAVORITES_EVENT = "favorites-updated";

const parseFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const serializeBlog = (blog) => ({
  _id: blog._id,
  title: blog.title,
  content: blog.content,
  category: blog.category,
  author: blog.author,
  createdAt: blog.createdAt,
});

const useFavoriteBlogs = () => {
  const [favorites, setFavorites] = useState(parseFavorites);

  const persist = (next) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  };

  const isFavorite = (id) => favorites.some((blog) => blog._id === id);

  const toggleFavorite = (blog) => {
    if (!blog?._id) return;

    const exists = favorites.some((item) => item._id === blog._id);
    if (exists) {
      persist(favorites.filter((item) => item._id !== blog._id));
      return;
    }

    persist([serializeBlog(blog), ...favorites]);
  };

  const totalFavorites = useMemo(() => favorites.length, [favorites]);

  useEffect(() => {
    const syncFavorites = () => setFavorites(parseFavorites());

    window.addEventListener("storage", syncFavorites);
    window.addEventListener(FAVORITES_EVENT, syncFavorites);

    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener(FAVORITES_EVENT, syncFavorites);
    };
  }, []);

  return {
    favorites,
    totalFavorites,
    isFavorite,
    toggleFavorite,
  };
};

export default useFavoriteBlogs;
