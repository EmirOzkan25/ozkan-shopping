import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import toast from "react-hot-toast";

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Ürün bulunamadı.");
        setLoading(false);
      });
  }, [id]);

  // Kalbe tıklanınca
  function handleFavorite() {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    if (isFavorite(product.id)) {
      toggleFavorite(product.id);
      toast("Favorilerden çıkarıldı", { icon: "💔", id: "favori" });
    } else {
      toggleFavorite(product.id);
      toast("Favorilere eklendi", { icon: "❤️", id: "favori" });
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Ana sayfaya dön
        </Link>
      </div>
    );
  }

  let stokDurumu;
  if (product.stock === 0) {
    stokDurumu = <span className="text-red-600 font-medium">Tükendi</span>;
  } else if (product.stock <= 5) {
    stokDurumu = (
      <span className="text-orange-600 font-medium">
        Son {product.stock} ürün!
      </span>
    );
  } else {
    stokDurumu = <span className="text-green-600 font-medium">Stokta var</span>;
  }

  const favori = isFavorite(product.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        ← Ürünlere dön
      </Link>

      <div className="bg-white rounded-2xl shadow-md p-8 mt-4 flex flex-col md:flex-row gap-8">
       <div className="md:w-1/2 bg-slate-100 rounded-xl flex items-center justify-center h-80 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-300 text-6xl">📦</span>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col">
          {/* Başlık + kalp */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-3">
              {product.name}
            </h1>
            <button
              onClick={handleFavorite}
              className="text-3xl shrink-0 hover:scale-110 transition"
              title={favori ? "Favorilerden çıkar" : "Favorilere ekle"}
            >
              {favori ? "❤️" : "🤍"}
            </button>
          </div>

          <p className="text-slate-500 mb-6">{product.description}</p>

          <div className="text-4xl font-bold text-blue-600 mb-4">
            {product.price.toLocaleString("tr-TR")} ₺
          </div>

          <div className="mb-6">{stokDurumu}</div>

          <button
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className={`mt-auto px-6 py-3 rounded-xl font-medium text-white transition ${
              product.stock === 0
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;