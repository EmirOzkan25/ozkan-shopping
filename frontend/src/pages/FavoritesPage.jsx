import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import toast from "react-hot-toast";

function FavoritesPage() {
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite, removeFavorite, addFavorite } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tüm ürünleri çek (favori id'lerle eşleştirmek için)
  useEffect(() => {
    api
      .get("/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Giriş yapılmamışsa
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Favorilerinizi görmek için giriş yapın
        </h1>
        <Link
          to="/login"
          className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Yükleniyor...</div>;
  }

  // Favoriden çıkar + geri al seçeneği sun
  function handleRemove(productId) {
    removeFavorite(productId); // net çıkarma

    toast(
      (t) => (
        <span className="flex items-center gap-3">
          Favorilerden çıkarıldı
          <button
            onClick={() => {
              addFavorite(productId); // net geri ekleme
              toast.dismiss(t.id);
            }}
            className="text-pink-600 font-semibold hover:underline"
          >
            Geri Al
          </button>
        </span>
      ),
      { icon: "💔", duration: 4000, id: "undo-favori" }
    );
  }
  // Favori id'lere göre ürünleri süz
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  // Hiç favori yoksa
  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Henüz favoriniz yok
        </h1>
        <p className="text-slate-500 mb-6">
          Beğendiğiniz ürünleri kalbe tıklayarak ekleyin.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
        >
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Favorilerim ({favoriteProducts.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-5 relative"
          >
            {/* Kalp butonu - çıkarmak için */}
            <button
              onClick={() => handleRemove(product.id)}
              className="absolute top-3 right-3 text-2xl"
              title="Favorilerden çıkar"
            >
              ❤️
            </button>

            <Link to={`/product/${product.id}`} className="block">
              <h2 className="text-lg font-semibold text-slate-800 pr-8">
                {product.name}
              </h2>
              <p className="text-slate-500 text-sm mt-1 mb-3">
                {product.description}
              </p>
              <span className="text-xl font-bold text-blue-600">
                {product.price.toLocaleString("tr-TR")} ₺
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;