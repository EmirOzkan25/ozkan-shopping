import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  // Favori ürün id'lerini tutuyoruz: [5, 12, 3]
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Kullanıcı giriş yapınca favorilerini çek, çıkınca temizle
  useEffect(() => {
    if (user) {
      api
        .get("/favorites")
        .then((response) => {
          // Backend favori nesneleri dönüyor, biz sadece product_id'leri alıyoruz
          setFavoriteIds(response.data.map((fav) => fav.product_id));
        })
        .catch(() => setFavoriteIds([]));
    } else {
      setFavoriteIds([]);
    }
  }, [user]);

  // Bir ürün favoride mi?
  function isFavorite(productId) {
    return favoriteIds.includes(productId);
  }

  // Favoriye ekle / çıkar (toggle)
  // Favoriye ekle
  async function addFavorite(productId) {
    try {
      await api.post(`/favorites/${productId}`);
      setFavoriteIds((prev) =>
        prev.includes(productId) ? prev : [...prev, productId]
      );
    } catch (err) {
      // 400 = zaten favoride, sorun değil; sadece state'i düzelt
      setFavoriteIds((prev) =>
        prev.includes(productId) ? prev : [...prev, productId]
      );
    }
  }

  // Favoriden çıkar
  async function removeFavorite(productId) {
    try {
      await api.delete(`/favorites/${productId}`);
    } catch (err) {
      // 404 = zaten yok, sorun değil
    }
    setFavoriteIds((prev) => prev.filter((id) => id !== productId));
  }

  // Favoriye ekle / çıkar (toggle)
  async function toggleFavorite(productId) {
    if (isFavorite(productId)) {
      await removeFavorite(productId);
    } else {
      await addFavorite(productId);
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite, toggleFavorite, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}